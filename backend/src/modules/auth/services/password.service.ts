/**
 * @file password.service.ts
 * @description 密码服务工厂，基于 bcrypt 提供密码哈希与比对能力
 */

import bcrypt from 'bcrypt';
import { env } from '@/config';
import type { PasswordService } from '@my-app/shared';

export type { PasswordService };
/**
 * 创建密码服务
 * @returns PasswordService 实例，提供 hash 和 compare 方法
 */
export function createPasswordService(): PasswordService {
  return {
    /**
     * 将明文密码哈希为安全存储的密文
     * @param password 明文密码
     * @returns 哈希后的密码字符串
     */
    hash: async (password: string) => bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS),
    /**
     * 比对明文密码与哈希密文是否匹配
     * @param password 明文密码
     * @param hash 哈希密文
     * @returns 匹配返回 true，否则返回 false
     */
    compare: async (password: string, hash: string) => bcrypt.compare(password, hash),
  };
}
