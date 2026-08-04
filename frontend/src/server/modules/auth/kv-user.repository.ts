import 'server-only';
import { getKV } from '@server/infrastructure/kv-mock';
import type { User, UserRepository } from '@my-app/shared';
import { KVRepository } from '@server/infrastructure/kv-repository';

export type { UserRepository };

export class KVUserRepository extends KVRepository<User> implements UserRepository {
  constructor() {
    super('users');
  }

  // ponytail: 全量扫描查找 email，用户量增大后应使用已有的 users:email: 索引直接 GET。
  async findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.toLowerCase();
    const users = await this.findAll();
    return users.find((u) => u.email.toLowerCase() === normalized);
  }

  async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    const users = await this.findAll();
    return users.some((u) => u.email.toLowerCase() === normalizedEmail || u.username === username);
  }

  // 覆盖 create 和 update 以维护 email/username 索引
  async create(user: User): Promise<User> {
    const kv = getKV();
    await kv.set(`users:email:${user.email.toLowerCase()}`, user.id);
    await kv.set(`users:username:${user.username}`, user.id);
    return super.create(user);
  }

  async update(id: string, partial: Partial<User>): Promise<User | undefined> {
    const kv = getKV();
    const updated = await super.update(id, partial);
    if (updated) {
      await kv.set(`users:email:${updated.email.toLowerCase()}`, updated.id);
      await kv.set(`users:username:${updated.username}`, updated.id);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const kv = getKV();
    const user = await this.findById(id);
    if (user) {
      await kv.set(`users:email:${user.email.toLowerCase()}`, '');
      await kv.set(`users:username:${user.username}`, '');
    }
    return super.delete(id);
  }
}
