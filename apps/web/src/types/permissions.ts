/**
 * 권한 시스템 타입 정의
 * 
 * 권한은 문자열로 자유롭게 정의할 수 있습니다.
 * 예: 'admin', 'writer', 'editor', 'vip' 등
 */

export type Permission = string;

export interface PermissionConfig {
  // GitHub 사용자 이름 -> 권한 목록 매핑
  allowedUsers: {
    [username: string]: Permission[];
  };
}

// 기본 권한 설정
export const DEFAULT_PERMISSION_CONFIG: PermissionConfig = {
  allowedUsers: {
    // 여기에 허용할 GitHub 사용자 이름과 권한을 추가하세요
    // 예: 
    // 'octocat': ['admin', 'writer'],
    // 'another-user': ['writer'],
  },
};

export interface UserPermissions {
  permissions: Permission[];
  isAllowed: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

