/**
 * 本地开发的 KV mock — 在没有 Upstash Redis 环境变量时使用内存存储。
 * 仅用于开发/测试，生产环境使用 @upstash/redis。
 */

/**
 * KV 适配器统一接口，MockKV 和 @upstash/redis 均需实现此接口。
 * 解决联合类型泛型方法调用时 TS 推断为 unknown 的问题。
 */
export interface KVAdapter {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: string): Promise<void>;
  hset(key: string, field: string | Record<string, string>, value?: string): Promise<number>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hgetall<T>(key: string): Promise<T | null>;
  hmget<T>(key: string, ...fields: string[]): Promise<(T | null)[]>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  pipeline(): KVPipeline;
}

export interface KVPipeline {
  set(key: string, value: string): KVPipeline;
  hset(key: string, field: string | Record<string, string>, value?: string): KVPipeline;
  hdel(key: string, ...fields: string[]): KVPipeline;
  sadd(key: string, ...members: string[]): KVPipeline;
  srem(key: string, ...members: string[]): KVPipeline;
  exec(): Promise<unknown[]>;
}

class MockKV implements KVAdapter {
  private store = new Map<string, string>();
  private hashes = new Map<string, Map<string, string>>();
  private sets = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const val = this.store.get(key);
    if (!val) return null;
    // KVDocumentStore 存储的是 JSON.stringify 后的值，get 应返回原始字符串让调用方解析
    // 但 @upstash/redis 的 get 会自动反序列化，所以我们模拟该行为
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as unknown as T;
    }
  }

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async hset(key: string, field: string | Record<string, string>, value?: string): Promise<number> {
    if (!this.hashes.has(key)) this.hashes.set(key, new Map());
    const hash = this.hashes.get(key)!;
    if (typeof field === 'string' && value !== undefined) {
      const isNew = !hash.has(field);
      hash.set(field, value);
      return isNew ? 1 : 0;
    }
    if (typeof field === 'object') {
      let count = 0;
      for (const [k, v] of Object.entries(field)) {
        const isNew = !hash.has(k);
        hash.set(k, v);
        if (isNew) count++;
      }
      return count;
    }
    return 0;
  }

  async hget<T = string>(key: string, field: string): Promise<T | null> {
    const hash = this.hashes.get(key);
    if (!hash) return null;
    const val = hash.get(field);
    // 返回原始字符串，让调用方自行 JSON.parse
    return (val as unknown as T) ?? null;
  }

  async hgetall<T = Record<string, string>>(key: string): Promise<T | null> {
    const hash = this.hashes.get(key);
    if (!hash || hash.size === 0) return null;
    const obj: Record<string, string> = {};
    for (const [k, v] of hash) obj[k] = v;
    return obj as T;
  }

  async hmget<T = string>(key: string, ...fields: string[]): Promise<(T | null)[]> {
    const hash = this.hashes.get(key);
    if (!hash) return fields.map(() => null);
    return fields.map((f) => {
      const val = hash.get(f);
      return (val as unknown as T) ?? null;
    });
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const hash = this.hashes.get(key);
    if (!hash) return 0;
    let count = 0;
    for (const f of fields) {
      if (hash.delete(f)) count++;
    }
    return count;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    const set = this.sets.get(key)!;
    let count = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        count++;
      }
    }
    return count;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const set = this.sets.get(key);
    if (!set) return 0;
    let count = 0;
    for (const m of members) {
      if (set.delete(m)) count++;
    }
    return count;
  }

  async smembers(key: string): Promise<string[]> {
    const set = this.sets.get(key);
    return set ? Array.from(set) : [];
  }

  pipeline(): KVPipeline {
    const ops: Array<() => Promise<unknown>> = [];
    const pipeline: KVPipeline = {
      set: (key: string, value: string) => {
        ops.push(() => this.set(key, value).then(() => undefined));
        return pipeline;
      },
      hset: (key: string, field: string | Record<string, string>, value?: string) => {
        ops.push(() => this.hset(key, field, value).then(() => undefined));
        return pipeline;
      },
      hdel: (key: string, ...fields: string[]) => {
        ops.push(() => this.hdel(key, ...fields).then(() => undefined));
        return pipeline;
      },
      sadd: (key: string, ...members: string[]) => {
        ops.push(() => this.sadd(key, ...members).then(() => undefined));
        return pipeline;
      },
      srem: (key: string, ...members: string[]) => {
        ops.push(() => this.srem(key, ...members).then(() => undefined));
        return pipeline;
      },
      async exec(): Promise<unknown[]> {
        const results: unknown[] = [];
        for (const op of ops) {
          results.push(await op());
        }
        return results;
      },
    };
    return pipeline;
  }
}

// 挂在 globalThis 上，确保 dev 模式下跨模块实例共享
const globalForKV = globalThis as unknown as { __mockKV?: MockKV };
const mockKV = (globalForKV.__mockKV ??= new MockKV());

/**
 * Upstash Redis 适配器 — 将 @upstash/redis 包装为 KVAdapter 接口
 */
class UpstashKVAdapter implements KVAdapter {
  private client: Redis;

  constructor(client: Redis) {
    this.client = client;
  }

  async get<T>(key: string): Promise<T | null> {
    // Upstash get 默认会自动反序列化 JSON，与 MockKV 行为一致
    // KVDocumentStore 依赖 get 返回反序列化后的对象
    const val = await this.client.get<T>(key);
    return val ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async hset(key: string, field: string | Record<string, string>, value?: string): Promise<number> {
    if (typeof field === 'string' && value !== undefined) {
      const result = await this.client.hset(key, { [field]: value });
      return result;
    }
    if (typeof field === 'object') {
      const result = await this.client.hset(key, field);
      return result;
    }
    return 0;
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    // Upstash hget 默认会自动反序列化 value。
    // KVRepository.findById 期望 hget 返回原始 JSON 字符串，然后自己 JSON.parse。
    // 所以需要把反序列化后的对象重新 stringify。
    const val = await this.client.hget<unknown>(key, field);
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val as unknown as T;
    return JSON.stringify(val) as unknown as T;
  }

  async hgetall<T>(key: string): Promise<T | null> {
    // Upstash hgetall 自带 deserialize4，会把 [k1,v1,k2,v2,...] 转成 {k1: JSON.parse(v1), ...}
    // 我们需要返回 Record<string, string>（原始 JSON 字符串），与 MockKV 一致
    const val = await (
      this.client.hgetall as (key: string) => Promise<Record<string, unknown> | null>
    )(key);
    if (!val) return null;
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(val)) {
      result[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    return result as unknown as T;
  }

  async hmget<T>(key: string, ...fields: string[]): Promise<(T | null)[]> {
    // Upstash hmget 的 deserialize5 返回 { field: JSON.parse(value) } 对象，不是数组。
    // 我们需要返回 (T | null)[]，与 MockKV 一致（数组，每个元素是原始字符串或 null）。
    const val = await (
      this.client.hmget as (
        key: string,
        ...fields: string[]
      ) => Promise<Record<string, unknown> | null>
    )(key, ...fields);
    if (!val) return fields.map(() => null);
    return fields.map((f) => {
      const v = val[f];
      if (v === null || v === undefined) return null;
      if (typeof v === 'string') return v as unknown as T;
      return JSON.stringify(v) as unknown as T;
    });
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return await (this.client.hdel as (key: string, ...fields: string[]) => Promise<number>)(
      key,
      ...fields,
    );
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return await (this.client.sadd as (key: string, ...members: string[]) => Promise<number>)(
      key,
      ...members,
    );
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return await (this.client.srem as (key: string, ...members: string[]) => Promise<number>)(
      key,
      ...members,
    );
  }

  async smembers(key: string): Promise<string[]> {
    return await this.client.smembers(key);
  }

  pipeline(): KVPipeline {
    const pipe = this.client.pipeline();
    const pipeline: KVPipeline = {
      set(key: string, value: string) {
        pipe.set(key, value);
        return pipeline;
      },
      hset(key: string, field: string | Record<string, string>, value?: string) {
        if (typeof field === 'string' && value !== undefined) {
          pipe.hset(key, { [field]: value });
        } else if (typeof field === 'object') {
          pipe.hset(key, field);
        }
        return pipeline;
      },
      hdel(key: string, ...fields: string[]) {
        (pipe as { hdel: (key: string, ...fields: string[]) => void }).hdel(key, ...fields);
        return pipeline;
      },
      sadd(key: string, ...members: string[]) {
        (pipe as { sadd: (key: string, ...members: string[]) => void }).sadd(key, ...members);
        return pipeline;
      },
      srem(key: string, ...members: string[]) {
        (pipe as { srem: (key: string, ...members: string[]) => void }).srem(key, ...members);
        return pipeline;
      },
      async exec(): Promise<unknown[]> {
        return await pipe.exec();
      },
    };
    return pipeline;
  }
}

import { Redis } from '@upstash/redis';

let upstashClient: UpstashKVAdapter | null = null;

export function getKV(): KVAdapter {
  // 优先使用 Upstash Redis（生产环境）
  const kvUrl = process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    if (!upstashClient) {
      upstashClient = new UpstashKVAdapter(
        new Redis({
          url: kvUrl,
          token: kvToken,
        }),
      );
    }
    return upstashClient;
  }
  // 本地开发使用 mock
  return mockKV;
}
