'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/auth';

const AUTH_WORKER_URL = process.env.NEXT_PUBLIC_AUTH_WORKER_URL || 'https://blog-auth-worker.jook1356.workers.dev';
const TOKEN_KEY = 'auth_token';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // 토큰을 로컬 스토리지에서 가져오기
  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  // 토큰을 로컬 스토리지에 저장
  const setToken = useCallback((token: string | null) => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  // 사용자 정보 확인
  const checkAuth = useCallback(async () => {
    const token = getToken();
    
    if (!token) {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await fetch(`${AUTH_WORKER_URL}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user: User = await response.json();
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      } else {
        // 토큰이 유효하지 않음
        setToken(null);
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        loading: false,
        error: 'Authentication check failed',
      });
    }
  }, [getToken, setToken]);

  // 로그인 시작
  const login = useCallback(() => {
    // GitHub Pages의 basePath를 고려한 콜백 URL 생성
    // next.config.ts에서 설정된 basePath를 동적으로 감지
    const isGitHubPages = window.location.hostname === 'jook1356.github.io';
    const repository = isGitHubPages ? 'djb-gith' : '';
    const callbackUrl = repository 
      ? `${window.location.origin}/${repository}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    
    const authUrl = `${AUTH_WORKER_URL}/auth/start?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    
    // 팝업으로 OAuth 시작
    const popup = window.open(
      authUrl, 
      'oauth', 
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // postMessage 리스너 등록
    const handleMessage = (event: MessageEvent) => {
      // 보안: 올바른 origin에서 온 메시지인지 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'AUTH_SUCCESS' && event.data.token) {
        // 토큰 저장
        setToken(event.data.token);
        // 사용자 정보 다시 로드
        checkAuth();
        // 리스너 제거
        window.removeEventListener('message', handleMessage);
      } else if (event.data.type === 'AUTH_ERROR') {
        console.error('Authentication error:', event.data.error);
        setAuthState(prev => ({
          ...prev,
          error: event.data.error,
          loading: false
        }));
        // 리스너 제거
        window.removeEventListener('message', handleMessage);
      }
    };

    // 메시지 리스너 등록
    window.addEventListener('message', handleMessage);

    // 팝업이 닫혔는지 체크 (사용자가 수동으로 닫은 경우)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
      }
    }, 1000);
  }, [checkAuth, setToken]);

  // 로그아웃
  const logout = useCallback(async () => {
    const token = getToken();
    
    if (token) {
      try {
        await fetch(`${AUTH_WORKER_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    
    setToken(null);
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  }, [getToken, setToken]);

  // 초기 인증 상태 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 콜백 페이지가 아닌 경우에만 토큰 체크
    if (!window.location.pathname.includes('/auth/callback')) {
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
