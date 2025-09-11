/**
 * 쿠키 유틸리티 함수들
 */

const TOKEN_KEY = "auth_token";

/**
 * 쿠키 설정
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void => {
  if (typeof window === "undefined") return;

  const {
    days = 1, // 기본 1일
    path = "/",
    domain,
    secure = window.location.protocol === "https:",
    sameSite = "Lax",
  } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  let cookieString = `${name}=${encodeURIComponent(value)}`;
  cookieString += `; expires=${expires.toUTCString()}`;
  cookieString += `; path=${path}`;
  
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += "; secure";
  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * 쿠키 가져오기
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

/**
 * 쿠키 제거
 */
export const removeCookie = (name: string, path: string = "/"): void => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}`;
};

// 토큰 전용 함수들
/**
 * 토큰을 쿠키에서 가져오기
 */
export const getToken = (): string | null => {
  return getCookie(TOKEN_KEY);
};

/**
 * 토큰을 쿠키에 저장 (24시간)
 */
export const setToken = (token: string | null): void => {
  if (token) {
    setCookie(TOKEN_KEY, token, {
      days: 1, // 24시간
      secure: true,
      sameSite: "Lax",
    });
  } else {
    removeToken();
  }
};

/**
 * 토큰을 쿠키에서 제거
 */
export const removeToken = (): void => {
  removeCookie(TOKEN_KEY);
};
