/**
 * @file auth.seed.ts
 * @description auth 模块种子数据写入入口，将种子用户批量灌入仓储
 */

import type { UserRepository } from './auth.repository.ts';
import type { PasswordService } from '../services/password.service.ts';
import { getSeedUsers } from './auth.seed.data.ts';

/**
 * 初始化 auth 模块种子数据
 * @param repo 用户仓储实例
 * @param passwordService 密码服务实例，用于生成密码哈希
 * @throws 仓储写入失败时抛出异常
 */
export async function seedAuthData(
  repo: UserRepository,
  passwordService: PasswordService,
): Promise<void> {
  const users = await getSeedUsers(passwordService);
  await repo.seed(users);
}
