"use client";

import { useState, useEffect, useCallback } from "react";
import { User, AuthState } from "@/types/auth";
import { getUserInfoAPI, logoutAPI, getAuthStartUrl } from "@/api/auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // 사용자 정보 확인 (HttpOnly 쿠키 기반)
  const checkAuth = useCallback(async () => {
    try {
      const user = await getUserInfoAPI();
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      // HttpOnly 쿠키가 없거나 만료된 경우
      setAuthState({
        user: null,
        loading: false,
        error: null, // 인증 실패는 에러가 아님
      });
    }
  }, []);

  // 로그인 시작
  const login = useCallback(() => {
    // GitHub Pages의 basePath를 고려한 콜백 URL 생성
    // next.config.ts에서 설정된 basePath를 동적으로 감지
    const isGitHubPages = window.location.hostname === "jook1356.github.io";
    const repository = isGitHubPages ? "djb-gith" : "";
    const callbackUrl = repository
      ? `${window.location.origin}/${repository}/auth/callback`
      : `${window.location.origin}/auth/callback`;

    const authUrl = getAuthStartUrl(callbackUrl);

    // 팝업으로 OAuth 시작
    const popup = window.open(
      authUrl,
      "oauth",
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    // postMessage 리스너 등록
    const handleMessage = (event: MessageEvent) => {
      // 보안: 올바른 origin에서 온 메시지인지 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "AUTH_SUCCESS") {
        // HttpOnly 쿠키가 이미 설정되었으므로 사용자 정보만 로드
        checkAuth();
        // 리스너 제거
        window.removeEventListener("message", handleMessage);
      } else if (event.data.type === "AUTH_ERROR") {
        console.error("Authentication error:", event.data.error);
        setAuthState((prev) => ({
          ...prev,
          error: event.data.error,
          loading: false,
        }));
        // 리스너 제거
        window.removeEventListener("message", handleMessage);
      }
    };

    // 메시지 리스너 등록
    window.addEventListener("message", handleMessage);

    // 팝업이 닫혔는지 체크 (사용자가 수동으로 닫은 경우)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  }, [checkAuth]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await logoutAPI(); // 서버에서 HttpOnly 쿠키 삭제
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    // 상태 초기화
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  // 초기 인증 상태 확인
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 콜백 페이지가 아닌 경우에만 토큰 체크
    if (!window.location.pathname.includes("/auth/callback")) {
      checkAuth();
    }
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
}
