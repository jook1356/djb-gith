/**
 * 권한 체크 훅
 */

'use client';

import { useMemo } from 'react';
import { useAuthContext } from '@/components/Auth/AuthProvider';
import { Permission } from '@/types/permissions';
import { createUserPermissions } from '@/lib/permissions';

/**
 * 사용자 권한을 관리하는 훅
 */
export function usePermissions() {
  const { user, loading } = useAuthContext();
  
  const userPermissions = useMemo(() => {
    return createUserPermissions(user);
  }, [user]);
  
  return {
    ...userPermissions,
    loading,
    user,
  };
}

/**
 * 특정 권한이 있는지 확인하는 훅
 */
export function useHasPermission(permission: Permission) {
  const { isAllowed, loading } = usePermissions();
  
  return {
    hasPermission: isAllowed(permission),
    loading,
  };
}

/**
 * 여러 권한 중 하나라도 있는지 확인하는 훅
 */
export function useHasAnyPermission(permissions: Permission[]) {
  const { hasAnyPermission, loading } = usePermissions();
  
  return {
    hasPermission: hasAnyPermission(permissions),
    loading,
  };
}

/**
 * 모든 권한이 있는지 확인하는 훅
 */
export function useHasAllPermissions(permissions: Permission[]) {
  const { hasAllPermissions, loading } = usePermissions();
  
  return {
    hasPermission: hasAllPermissions(permissions),
    loading,
  };
}

/**
 * 특정 권한들 중 하나라도 있는지 확인하는 훅 (배열 형태로 사용)
 */
export function useRequirePermission(requiredPermissions: Permission[]) {
  const { hasAnyPermission, loading, user } = usePermissions();
  
  return {
    hasAccess: hasAnyPermission(requiredPermissions),
    loading,
    user,
  };
}

