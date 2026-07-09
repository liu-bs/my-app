import { AuthResponse, ChangePasswordDto, LoginDto, RegisterDto } from "@my-app/shared";

// ─── 表单状态 ────────────────────────────────────────

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

// ─── Context ─────────────────────────────────────────

export interface AuthContextValue {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  updateUser: (user: AuthResponse["user"]) => void;
  logout: () => void;
}

// ─── 从 @my-app/shared 重新导出 ──────────────────────

export type { AuthResponse, LoginDto, RegisterDto, ChangePasswordDto };
