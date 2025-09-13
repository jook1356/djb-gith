import axios, { AxiosError, AxiosResponse } from "axios";

// 환경에 따른 baseURL 설정
function getApiBaseUrl(): string {
  // 개발: Next 프록시 경유
  if (process.env.NODE_ENV === "development") {
    return "/api";
  }
  // 배포: 워커 절대 URL 사용
  return process.env.NEXT_PUBLIC_AUTH_WORKER_URL || "/api";
}

/**
 * 인증이 필요 없는 기본 요청 인스턴스
 */
export const defaultInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false,
});

/**
 * GitHub OAuth 인증을 사용하는 요청 인스턴스
 * httpOnly 쿠키를 통해 자동으로 인증됩니다.
 */
export const authInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

/**
 * 인증이 필요 없는 FormData 요청 인스턴스
 */
export const formDataInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/**
 * GitHub OAuth 인증을 사용하는 FormData 요청 인스턴스
 */
export const formDataAuthInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// 호환성을 위한 alias
export const tokenInstance = authInstance;
export const formDataTokenInstance = formDataAuthInstance;

// ----------------------------------------------------------------------------------------
// 인터셉터 설정 (GitHub OAuth 시스템용)
// ----------------------------------------------------------------------------------------

/**
 * authInstance 응답 인터셉터
 * GitHub OAuth의 httpOnly 쿠키 기반 인증에서는 별도의 토큰 처리가 불필요합니다.
 * 401 에러는 useAuth의 checkAuth()를 통해 전역적으로 처리됩니다.
 */
authInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // GitHub OAuth에서는 401 에러 시 useAuth.checkAuth()가 자동으로 사용자 상태를 업데이트합니다.
    // 별도의 로그아웃 처리나 토큰 갱신은 불필요합니다.
    return Promise.reject(error);
  }
);

/**
 * formDataAuthInstance 응답 인터셉터
 */
formDataAuthInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
