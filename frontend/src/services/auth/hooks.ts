"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./context";
import type { LoginDto } from "./types";
import { changePassword, loginUser, logoutUser, registerUser } from "./api";

/** 通用消息状态 hook：为 mutation 提供 errorMsg / successMsg / clearMessages */
function useMutationMessages() {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const clearMessages = useCallback(() => {
    setErrorMsg("");
    setSuccessMsg("");
  }, []);
  return { errorMsg, setErrorMsg, successMsg, setSuccessMsg, clearMessages };
}

/** 登录：调接口 → 拉用户 → 写入 Context → 跳转 */
export function useLogin() {
  const { updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { errorMsg, setErrorMsg, clearMessages } = useMutationMessages();

  const getRedirectUrl = useCallback(() => {
    const raw = searchParams.get("redirect") || "/";
    return raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/";
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const user = await loginUser(data);
      return user;
    },
    onSuccess: (user) => {
      updateUser(user);
      router.push(getRedirectUrl());
    },
    onError: (err) => setErrorMsg(err.message || "登录失败，请重试"),
  });

  return { ...mutation, errorMsg, clearMessages };
}

/** 注册 */
export function useRegister() {
  const { errorMsg, successMsg, setErrorMsg, setSuccessMsg, clearMessages } = useMutationMessages();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => setSuccessMsg("注册成功，正在跳转登录页…"),
    onError: (err) => setErrorMsg(err.message || "注册失败，请重试"),
  });

  return { ...mutation, errorMsg, successMsg, clearMessages };
}

/** 登出：调后端清 Cookie → 本地登出（后端失败也登出） */
export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: logout,
  });
}

/** 修改密码 */
export function useChangePassword() {
  const { errorMsg, successMsg, setErrorMsg, setSuccessMsg, clearMessages } = useMutationMessages();

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => setSuccessMsg("密码修改成功，请重新登录"),
    onError: (err) => setErrorMsg(err.message || "修改密码失败，请重试"),
  });

  return { ...mutation, errorMsg, successMsg, clearMessages };
}

