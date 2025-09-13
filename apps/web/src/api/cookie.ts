/**
 * 쿠키를 가져오는 유틸리티 함수
 *
 * 주의: GitHub OAuth 인증 쿠키는 httpOnly로 설정되어 JavaScript에서 접근할 수 없습니다.
 * 이 함수는 다른 클라이언트 사이드 쿠키 관리용으로 사용하세요.
 *
 * @param name - 가져올 쿠키의 이름
 * @returns 쿠키 값 또는 null
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue || null;
  }

  return null;
};

/**
 * 쿠키를 설정하는 유틸리티 함수
 * @param name - 설정할 쿠키의 이름
 * @param value - 설정할 쿠키의 값
 * @param days - 쿠키 만료일 (기본: 7일)
 * @param path - 쿠키 경로 (기본: '/')
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 7,
  path: string = "/"
): void => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=${path}`;
};

/**
 * 쿠키를 삭제하는 유틸리티 함수
 * @param name - 삭제할 쿠키의 이름
 * @param path - 쿠키 경로 (기본: '/')
 */
export const removeCookie = (name: string, path: string = "/"): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
};
