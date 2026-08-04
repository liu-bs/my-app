import 'server-only';
import bcrypt from 'bcryptjs';
import { env } from '@server/config/env';
import type { PasswordService } from '@my-app/shared';

export type { PasswordService };

export function createPasswordService(): PasswordService {
  return {
    hash: async (password: string) => bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS),
    compare: async (password: string, hash: string) => bcrypt.compare(password, hash),
  };
}
