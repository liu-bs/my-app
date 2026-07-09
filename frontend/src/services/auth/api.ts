import type { AuthResponse } from "@my-app/shared";
import { http } from "@/lib/api";
import type { ChangePasswordDto, LoginDto, RegisterDto } from "./types";

// ─── 端点 ──────────────────────────────────────────────

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",
  ME: "/auth/me",
} as const;

// ─── 纯函数 ────────────────────────────────────────────

/** 获取当前用户信息 */
export async function fetchUser(): Promise<AuthResponse["user"]> {
  const res = await http.get<AuthResponse>(AUTH_ENDPOINTS.ME, { skipAuthRedirect: true });
  if (!res?.user) throw new Error("获取用户信息失败");
  return res.user;
}

/** 登录 → 拉取用户信息（skipAuthRedirect：凭据错误不应触发 401 全局跳转） */
export async function loginUser(data: LoginDto): Promise<AuthResponse["user"]> {
  await http.post(AUTH_ENDPOINTS.LOGIN, data, { skipAuthRedirect: true });
  return fetchUser();
}

/** 注册 */
export function registerUser(data: RegisterDto) {
  return http.post(AUTH_ENDPOINTS.REGISTER, data);
}

/** 登出（后端失败也静默） */
export function logoutUser() {
  return http.post(AUTH_ENDPOINTS.LOGOUT).catch(() => {});
}

/** 修改密码 */
export function changePassword(data: ChangePasswordDto) {
  return http.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
}
