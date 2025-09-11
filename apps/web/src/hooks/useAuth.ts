"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthContextType, User } from "@/types/auth";

function getBasePath(): string {
  if (process.env.NEXT_PUBLIC_BASE_PATH) return process.env.NEXT_PUBLIC_BASE_PATH;
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
  if (process.env.NODE_ENV === "development") {
    return "/api/worker";
  }
  // 배포: 워커 절대 URL 필요 (예: https://blog-auth-worker.workers.dev)
  return process.env.NEXT_PUBLIC_AUTH_WORKER_URL || "/api/worker";
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
      const res = await fetch(`${workerBase}/auth/user`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as User;
      setUser(data);
    
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Auth check failed");
      setUser(null);
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
      await fetch(`${workerBase}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
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


