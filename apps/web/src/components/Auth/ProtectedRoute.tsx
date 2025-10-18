/**
 * 페이지 레벨 권한 보호 컴포넌트
 * 권한이 없으면 에러 페이지 또는 리다이렉트
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Permission } from '@/types/permissions';
import { usePermissions } from '@/hooks/usePermissions';
import { getPermissionDeniedMessage } from '@/lib/permissions';
import styles from './ProtectedRoute.module.scss';

interface ProtectedRouteProps {
  children: React.ReactNode;
  
  // 접근에 필요한 권한 목록 (하나라도 있으면 허용)
  // 예: ['admin', 'writer']
  requires?: Permission[];
  
  // 권한이 없을 때 리다이렉트할 경로 (설정하지 않으면 에러 페이지 표시)
  redirectTo?: string;
  
  // 인증되지 않았을 때 리다이렉트할 경로
  loginRedirectTo?: string;
  
  // 커스텀 에러 메시지
  deniedMessage?: string;
}

export function ProtectedRoute({
  children,
  requires = [],
  redirectTo,
  loginRedirectTo = '/',
  deniedMessage,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasAnyPermission, loading, user } = usePermissions();
  
  useEffect(() => {
    // 로딩 중에는 체크하지 않음
    if (loading) return;
    
    // 인증되지 않은 경우
    if (!user) {
      if (loginRedirectTo) {
        router.push(loginRedirectTo);
      }
      return;
    }
    
    // 권한이 비어있으면 인증만 확인 (로그인만 되어있으면 통과)
    if (requires.length === 0) {
      return;
    }
    
    // 권한 체크: 지정된 권한 중 하나라도 있으면 허용
    const hasRequiredPermission = hasAnyPermission(requires);
    
    // 권한이 없는 경우
    if (!hasRequiredPermission && redirectTo) {
      router.push(redirectTo);
    }
  }, [
    loading,
    user,
    requires,
    redirectTo,
    loginRedirectTo,
    router,
    hasAnyPermission,
  ]);
  
  // 로딩 중
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>권한을 확인하는 중...</p>
      </div>
    );
  }
  
  // 인증되지 않음
  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h1>로그인이 필요합니다</h1>
        <p>이 페이지에 접근하려면 로그인해야 합니다.</p>
      </div>
    );
  }
  
  // 권한이 비어있으면 인증만 확인 (로그인만 되어있으면 통과)
  if (requires.length === 0) {
    return <>{children}</>;
  }
  
  // 권한 체크: 지정된 권한 중 하나라도 있으면 허용
  const hasRequiredPermission = hasAnyPermission(requires);
  let errorMsg = deniedMessage || `다음 권한 중 하나가 필요합니다: ${requires.join(', ')}`;
  
  // 권한이 없고 리다이렉트 경로가 없는 경우 에러 페이지 표시
  if (!hasRequiredPermission && !redirectTo) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" />
          </svg>
        </div>
        <h1>접근 권한이 없습니다</h1>
        <p>{errorMsg || '이 페이지에 접근할 권한이 없습니다.'}</p>
        <button 
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }
  
  // 권한이 있으면 자식 컴포넌트 렌더링
  return <>{children}</>;
}

