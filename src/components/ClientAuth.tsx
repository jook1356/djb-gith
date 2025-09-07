'use client';

import { useState, useEffect } from 'react';

interface User {
  login: string;
  name: string;
  avatar_url: string;
  id: number;
}

export default function ClientAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // GitHub OAuth 설정 (클라이언트 사이드)
  const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const ALLOWED_USERS = process.env.NEXT_PUBLIC_ALLOWED_USERS?.split(',') || [];

  useEffect(() => {
    // URL에서 OAuth 코드 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback(code);
    } else {
      // 로컬 스토리지에서 사용자 정보 확인
      const savedUser = localStorage.getItem('github_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      // GitHub에서 사용자 정보 가져오기 (클라이언트 사이드)
      const response = await fetch(`https://api.github.com/user`, {
        headers: {
          'Authorization': `token ${code}`, // 실제로는 access token이 필요
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // 허용된 사용자인지 확인
        if (ALLOWED_USERS.includes(userData.login)) {
          setUser(userData);
          localStorage.setItem('github_user', JSON.stringify(userData));
          // URL에서 code 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          alert('접근이 허용되지 않은 사용자입니다.');
        }
      }
    } catch (error) {
      console.error('OAuth 처리 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const redirectUri = window.location.origin;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('github_user');
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <span>인증 처리 중...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <img 
            src={user.avatar_url} 
            alt="프로필" 
            className="user-avatar"
          />
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <p className="user-github">@{user.login}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="auth-button logout-button"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button 
        onClick={handleLogin}
        className="auth-button login-button"
      >
        GitHub로 로그인
      </button>
    </div>
  );
}
