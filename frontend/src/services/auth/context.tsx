"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fetchUser } from "./api";
import type { AuthContextValue, AuthResponse } from "./types";

// ─── 常量 ────────────────────────────────────────────

const AUTH_CHANNEL_NAME = "auth_logout";

// ─── Context & useAuth ───────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 通过 auth_status Cookie 判断是否需要调 /auth/me 探测
  // 登录时后端种 auth_status=1，登出/改密时清除
  const hasAuthCookie = typeof document !== "undefined" && document.cookie.includes("auth_status");

  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // 初始化：有 auth_status Cookie 时调 /auth/me 恢复用户状态
  useEffect(() => {
    if (!hasAuthCookie) return;
    fetchUser().then(setUser).catch(() => {});
  }, [hasAuthCookie]);

  // BroadcastChannel：多 Tab 登出同步
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data === "logout") {
        setUser(null);
        window.location.href = "/login";
      }
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const updateUser = useCallback((newUser: AuthResponse["user"]) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    try {
      channelRef.current?.postMessage("logout");
    } catch {
      /* ignore */
    }
    setUser(null);
    window.location.href = "/login";
  }, [channelRef]);

  // 桥接到 window，供 request.ts 401 拦截时清除内存状态
  useEffect(() => {
    window.__AUTH_CONTEXT__ = { logout };
    return () => {
      delete window.__AUTH_CONTEXT__;
    };
  }, [logout]);

  const isAuthenticated = user !== null;

  const contextValue = useMemo(
    () => ({ user, isAuthenticated, updateUser, logout }),
    [user, isAuthenticated, updateUser, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
