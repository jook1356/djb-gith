import axios from "axios";
import { getToken, removeToken } from "@/utils/cookie";

const AUTH_WORKER_URL =
  process.env.NEXT_PUBLIC_AUTH_WORKER_URL ||
  "https://blog-auth-worker.jook1356.workers.dev";

/**
 * 인증이 필요 없는 기본 요청
 */
export const defaultInstance = axios.create({
  baseURL: AUTH_WORKER_URL,
  timeout: 10000,
  withCredentials: false,
});

/**
 * 인증이 필요한 요청
 */
export const tokenInstance = axios.create({
  baseURL: AUTH_WORKER_URL,
  timeout: 10000,
});

/**
 * tokenInstance 인터셉터 처리
 */
tokenInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    const token = getToken();

    // 토큰이 있다면 Authorization 헤더에 Bearer 토큰 추가
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

tokenInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 토큰 만료 또는 인증 오류 시
    if (error.response?.status === 401) {
      // 토큰 제거
      removeToken();

      // 로그인 페이지로 리다이렉트 (Next.js 환경에서)
      if (typeof window !== "undefined") {
        // 현재 페이지가 로그인 관련 페이지가 아닌 경우에만 리다이렉트
        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------------------------

/**
 * 외부 API 호출용 인스턴스 (GitHub API 등)
 */
export const externalInstance = axios.create({
  timeout: 10000,
  withCredentials: false,
});

/**
 * 인증이 필요한 외부 API 호출용 인스턴스
 */
export const externalTokenInstance = axios.create({
  timeout: 10000,
});

/**
 * externalTokenInstance 인터셉터 처리
 */
externalTokenInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

externalTokenInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth/")
      ) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
