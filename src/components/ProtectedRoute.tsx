'use client';

import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { ReactNode } from 'react';
import LoginButton from './LoginButton';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading, error, isAuthenticated } = useGitHubAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>인증 상태를 확인하는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>인증 오류</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="unauthorized-container">
        {fallback || (
          <div className="unauthorized-content">
            <h2>로그인이 필요합니다</h2>
            <p>이 페이지에 접근하려면 GitHub 계정으로 로그인해주세요.</p>
            <LoginButton />
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
