/**
 * 권한 체크 유틸리티 함수
 */

import { User } from '@/types/auth';
import { 
  Permission, 
  PermissionConfig, 
  DEFAULT_PERMISSION_CONFIG,
  UserPermissions,
} from '@/types/permissions';

/**
 * 환경 변수 또는 설정 파일에서 권한 설정 로드
 * 프로덕션에서는 환경 변수를 사용하는 것을 권장
 */
export function getPermissionConfig(): PermissionConfig {
  // 환경 변수에서 허용된 사용자 목록 로드
  const allowedUsersEnv = process.env.NEXT_PUBLIC_ALLOWED_USERS;
  
  if (allowedUsersEnv) {
    try {
      // 형식: "username1:perm1,perm2;username2:perm3"
      // 예: "octocat:admin,writer;user2:writer"
      const config = { ...DEFAULT_PERMISSION_CONFIG };
      const userEntries = allowedUsersEnv.split(';').filter(Boolean);
      
      userEntries.forEach(entry => {
        const [username, permsStr] = entry.split(':');
        if (username && permsStr) {
          const perms = permsStr.split(',').map(p => p.trim()).filter(Boolean);
          config.allowedUsers[username] = perms;
        }
      });
      
      return config;
    } catch (error) {
      console.warn('Failed to parse NEXT_PUBLIC_ALLOWED_USERS, using default config');
    }
  }
  
  return DEFAULT_PERMISSION_CONFIG;
}

/**
 * 사용자의 권한 목록 가져오기
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user) {
    return [];
  }
  
  const config = getPermissionConfig();
  const userPerms = config.allowedUsers[user.login] || [];
  
  return userPerms;
}

/**
 * 특정 권한이 있는지 확인
 */
export function hasPermission(
  user: User | null, 
  permission: Permission
): boolean {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
}

/**
 * 여러 권한 중 하나라도 있는지 확인
 */
export function hasAnyPermission(
  user: User | null, 
  permissions: Permission[]
): boolean {
  const userPermissions = getUserPermissions(user);
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * 모든 권한이 있는지 확인
 */
export function hasAllPermissions(
  user: User | null, 
  permissions: Permission[]
): boolean {
  const userPermissions = getUserPermissions(user);
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * 사용자 권한 객체 생성
 */
export function createUserPermissions(user: User | null): UserPermissions {
  const permissions = getUserPermissions(user);
  
  return {
    permissions,
    isAllowed: (permission: Permission) => hasPermission(user, permission),
    hasAnyPermission: (perms: Permission[]) => hasAnyPermission(user, perms),
    hasAllPermissions: (perms: Permission[]) => hasAllPermissions(user, perms),
  };
}

/**
 * 권한이 없을 때 표시할 기본 에러 메시지
 */
export function getPermissionDeniedMessage(permission: Permission): string {
  return `'${permission}' 권한이 없습니다.`;
}

