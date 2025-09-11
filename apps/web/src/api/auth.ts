const AUTH_WORKER_URL =
  process.env.NEXT_PUBLIC_AUTH_WORKER_URL ||
  "https://blog-auth-worker.jook1356.workers.dev";

import { User } from "@/types/auth";

/**
 * 사용자 정보 조회 API (HttpOnly 쿠키 기반)
 */
export const getUserInfoAPI = async (): Promise<User> => {
  const response = await fetch(`${AUTH_WORKER_URL}/auth/user`, {
    method: "GET",
    credentials: "include", // HttpOnly 쿠키 자동 전송
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * 로그아웃 API (HttpOnly 쿠키 기반)
 */
export const logoutAPI = async (): Promise<{ success: boolean }> => {
  const response = await fetch(`${AUTH_WORKER_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // HttpOnly 쿠키 자동 전송
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * GitHub OAuth 시작 URL 생성
 */
export const getAuthStartUrl = (redirectUri?: string): string => {
  const params = redirectUri
    ? `?redirect_uri=${encodeURIComponent(redirectUri)}`
    : "";
  return `${AUTH_WORKER_URL}/auth/start${params}`;
};
