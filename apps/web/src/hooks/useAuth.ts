"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthContextType, User } from "@/types/auth";
import axios from "axios";

function getBasePath(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH)
    return process.env.NEXT_PUBLIC_BASE_PATH;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.endsWith("github.io")) {
      const firstSeg = window.location.pathname.split("/").filter(Boolean)[0];
      return firstSeg ? `/${firstSeg}` : "";
    }
  }
  return "";
}

function getWorkerBaseUrl(): string {
  // 개발: Next 프록시 경유
  // if (process.env.NODE_ENV === "development") {
  //   return "/api/worker";
  // }
  // 배포: 워커 절대 URL 필요 (예: https://blog-auth-worker.workers.dev)
  return process.env.NEXT_PUBLIC_AUTH_WORKER_URL!;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const workerBase = useMemo(() => getWorkerBaseUrl(), []);
  const basePath = useMemo(() => getBasePath(), []);
  const loginWindowRef = useRef<Window | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${workerBase}/auth/user`, {
        withCredentials: true,
      });
      setUser(res.data as User);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        // 인증되지 않은 상태 (정상적인 경우)
        setUser(null);
      } else {
        setError(e instanceof Error ? e.message : "Auth check failed");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [workerBase]);

  const login = useCallback(() => {
    const callbackUrl = `${window.location.origin}${basePath}/auth/callback/`;
    const authStartUrl = `${workerBase}/auth/start?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}`;

    // 팝업 열기
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    loginWindowRef.current = window.open(
      authStartUrl,
      "github_oauth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // 콜백 페이지가 성공 메시지를 보내면 인증 재검사
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { type } = (event.data || {}) as { type?: string };
      if (type === "AUTH_SUCCESS") {
        window.removeEventListener("message", handler);
        try {
          loginWindowRef.current?.close();
        } catch {}
        checkAuth();
      }
      if (type === "AUTH_ERROR") {
        window.removeEventListener("message", handler);
        try {
          loginWindowRef.current?.close();
        } catch {}
        setError("Authentication failed");
      }
    };
    window.addEventListener("message", handler);
  }, [workerBase, basePath, checkAuth]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        `${workerBase}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, [workerBase]);

  useEffect(() => {
    // 초기 인증 상태 확인
    checkAuth();
  }, [checkAuth]);

  return { user, loading, error, login, logout, checkAuth };
}
