/**
 * @file auth.repository.ts
 * @description 用户仓储的 JSON 文件实现，提供按邮箱/用户名查询及全局单例获取能力
 */

import type { User, UserRepository } from '@my-app/shared';
import { JsonRepository } from '@/infrastructure/JsonRepository.ts';

export type { UserRepository };
/**
 * 基于 JSON 文件的用户仓储实现
 * @description 继承通用 JsonRepository，提供按邮箱/用户名查询等业务方法
 */
export class JsonUserRepository extends JsonRepository<User> implements UserRepository {
  /**
   * 初始化用户仓储，指定 JSON 文件名为 users.json
   */
  constructor() {
    super('users.json');
  }

  /**
   * 按邮箱查找用户（大小写不敏感）
   * @param email 用户邮箱
   * @returns 匹配的用户对象，未找到时返回 undefined
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.toLowerCase();
    const users = await this.findAll();
    return users.find((u) => u.email.toLowerCase() === normalized);
  }

  /**
   * 判断指定邮箱或用户名是否已存在
   * @param email 待检查的邮箱
   * @param username 待检查的用户名
   * @returns 已存在返回 true，否则返回 false
   */
  async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    const users = await this.findAll();
    return users.some((u) => u.email.toLowerCase() === normalizedEmail || u.username === username);
  }
}

/** 全局唯一的 JsonUserRepository 实例缓存 */
let userRepositoryInstance: JsonUserRepository | null = null;

/**
 * 获取全局唯一的 JsonUserRepository 实例（单例模式）
 * @returns JsonUserRepository 实例
 */
export function getJsonUserRepository(): JsonUserRepository {
  if (userRepositoryInstance === null) {
    userRepositoryInstance = new JsonUserRepository();
  }
  return userRepositoryInstance;
}
