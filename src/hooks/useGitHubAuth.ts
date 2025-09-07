'use client';

import { useState, useEffect } from 'react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  id: number;
  email?: string;
}

interface AuthState {
  user: GitHubUser | null;
  loading: boolean;
  error: string | null;
}

export function useGitHubAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // 환경 변수에서 설정 가져오기
  const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const ALLOWED_USERS = process.env.NEXT_PUBLIC_ALLOWED_USERS?.split(',').map(u => u.trim()) || [];

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // URL에서 OAuth 코드 확인
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setAuthState(prev => ({ ...prev, error: 'GitHub 인증이 거부되었습니다.', loading: false }));
        return;
      }

      if (code) {
        await handleOAuthCallback(code);
        // URL에서 code 파라미터 제거
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // 로컬 스토리지에서 저장된 토큰 확인
      const savedToken = localStorage.getItem('github_token');
      if (savedToken) {
        await validateAndSetUser(savedToken);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('인증 초기화 오류:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: '인증 초기화 중 오류가 발생했습니다.', 
        loading: false 
      }));
    }
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      // GitHub OAuth 토큰 교환을 위한 프록시 서비스 사용
      // 또는 GitHub Apps를 사용하여 직접 처리
      
      // 임시로 코드를 토큰으로 사용 (실제로는 토큰 교환 필요)
      // 실제 구현에서는 GitHub Apps나 프록시 서버를 사용해야 함
      
      // 여기서는 GitHub의 Device Flow나 Personal Access Token 방식을 시뮬레이션
      const token = await exchangeCodeForToken(code);
      
      if (token) {
        localStorage.setItem('github_token', token);
        await validateAndSetUser(token);
      }
    } catch (error) {
      console.error('OAuth 콜백 처리 오류:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'GitHub 인증 처리 중 오류가 발생했습니다.', 
        loading: false 
      }));
    }
  };

  const exchangeCodeForToken = async (code: string): Promise<string | null> => {
    // 실제로는 GitHub Apps나 프록시 서버를 통해 토큰을 교환해야 함
    // 여기서는 데모용으로 코드를 그대로 반환
    // 
    // 실제 구현 방법:
    // 1. GitHub Apps 사용
    // 2. Netlify Functions나 Vercel Functions 사용
    // 3. 별도 프록시 서버 구축
    
    console.warn('실제 환경에서는 안전한 토큰 교환이 필요합니다.');
    return code; // 임시 구현
  };

  const validateAndSetUser = async (token: string) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('GitHub API 호출 실패');
      }

      const userData: GitHubUser = await response.json();

      // 허용된 사용자인지 확인
      if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(userData.login)) {
        setAuthState(prev => ({ 
          ...prev, 
          error: `접근이 허용되지 않은 사용자입니다. (${userData.login})`, 
          loading: false 
        }));
        localStorage.removeItem('github_token');
        return;
      }

      setAuthState({
        user: userData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('사용자 정보 검증 오류:', error);
      setAuthState(prev => ({ 
        ...prev, 
        error: '사용자 정보를 가져올 수 없습니다.', 
        loading: false 
      }));
      localStorage.removeItem('github_token');
    }
  };

  const login = () => {
    if (!CLIENT_ID) {
      setAuthState(prev => ({ 
        ...prev, 
        error: 'GitHub Client ID가 설정되지 않았습니다.' 
      }));
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    const scope = 'user:email';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${Date.now()}`;
    
    window.location.href = githubAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
}
