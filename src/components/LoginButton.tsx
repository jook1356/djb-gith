'use client';

import { useGitHubAuth } from '@/hooks/useGitHubAuth';

export default function LoginButton() {
  const { user, loading, error, login, logout, isAuthenticated } = useGitHubAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <span>로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-error">
        <span>오류: {error}</span>
        <button onClick={() => window.location.reload()} className="retry-button">
          다시 시도
        </button>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <img 
            src={user.avatar_url} 
            alt="프로필" 
            className="user-avatar"
          />
          <div className="user-details">
            <p className="user-name">{user.name || user.login}</p>
            <p className="user-github">@{user.login}</p>
          </div>
        </div>
        <button 
          onClick={logout}
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
        onClick={login}
        className="auth-button login-button"
      >
        GitHub로 로그인
      </button>
    </div>
  );
}
