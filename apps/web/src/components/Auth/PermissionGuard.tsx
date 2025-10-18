/**
 * 권한 기반 컴포넌트 렌더링 가드
 * 지정된 권한이 있을 때만 자식 컴포넌트를 렌더링
 */

'use client';

import React from 'react';
import { Permission } from '@/types/permissions';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  
  // 접근에 필요한 권한 목록 (하나라도 있으면 허용)
  // 예: ['admin', 'writer']
  requires?: Permission[];
  
  // 권한이 없을 때 표시할 컴포넌트 (기본: null)
  fallback?: React.ReactNode;
  
  // 로딩 중일 때 표시할 컴포넌트 (기본: null)
  loadingFallback?: React.ReactNode;
  
  // 인증되지 않았을 때 표시할 컴포넌트
  unauthenticatedFallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  requires = [],
  fallback = null,
  loadingFallback = null,
  unauthenticatedFallback = null,
}: PermissionGuardProps) {
  const { hasAnyPermission, loading, user } = usePermissions();
  
  // 로딩 중
  if (loading) {
    return <>{loadingFallback}</>;
  }
  
  // 인증되지 않음
  if (!user) {
    return <>{unauthenticatedFallback ?? fallback}</>;
  }
  
  // 권한이 비어있으면 인증만 확인 (로그인만 되어있으면 통과)
  if (requires.length === 0) {
    return <>{children}</>;
  }
  
  // 권한 체크: 지정된 권한 중 하나라도 있으면 허용
  const hasRequiredPermission = hasAnyPermission(requires);
  
  // 권한이 있으면 자식 컴포넌트 렌더링
  if (hasRequiredPermission) {
    return <>{children}</>;
  }
  
  // 권한이 없으면 fallback 렌더링
  return <>{fallback}</>;
}

/**
 * 인증된 사용자만 볼 수 있는 컴포넌트
 */
interface AuthenticatedOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function AuthenticatedOnly({
  children,
  fallback = null,
  loadingFallback = null,
}: AuthenticatedOnlyProps) {
  const { user, loading } = usePermissions();
  
  if (loading) {
    return <>{loadingFallback}</>;
  }
  
  if (!user) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * 인증되지 않은 사용자만 볼 수 있는 컴포넌트
 */
interface UnauthenticatedOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function UnauthenticatedOnly({
  children,
  fallback = null,
  loadingFallback = null,
}: UnauthenticatedOnlyProps) {
  const { user, loading } = usePermissions();
  
  if (loading) {
    return <>{loadingFallback}</>;
  }
  
  if (user) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

