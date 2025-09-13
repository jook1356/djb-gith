// 쿠키 유틸리티 함수들 export
export { getCookie, setCookie, removeCookie } from "./cookie";

// Axios 인스턴스들 export
export {
  defaultInstance,
  authInstance,
  formDataInstance,
  formDataAuthInstance,
  // 호환성을 위한 alias
  tokenInstance,
  formDataTokenInstance,
} from "./instances";

// 편의를 위한 alias 제공
export const api = {
  // 인증이 필요 없는 요청
  default: async <T = any>(url: string, config?: any) => {
    const { defaultInstance } = await import("./instances");
    return defaultInstance<T>(url, config);
  },

  // GitHub OAuth 인증이 필요한 요청
  auth: async <T = any>(url: string, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance<T>(url, config);
  },

  // FormData 요청 (인증 없음)
  formData: async <T = any>(url: string, data: FormData, config?: any) => {
    const { formDataInstance } = await import("./instances");
    return formDataInstance.post<T>(url, data, config);
  },

  // FormData 요청 (GitHub OAuth 인증 필요)
  formDataAuth: async <T = any>(url: string, data: FormData, config?: any) => {
    const { formDataAuthInstance } = await import("./instances");
    return formDataAuthInstance.post<T>(url, data, config);
  },
} as const;

// HTTP 메서드별 헬퍼 함수들 (GitHub OAuth 인증 사용)
export const apiHelpers = {
  // GET 요청 (GitHub OAuth 인증 필요)
  get: async <T = any>(url: string, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance.get<T>(url, config);
  },

  // POST 요청 (GitHub OAuth 인증 필요)
  post: async <T = any>(url: string, data?: any, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance.post<T>(url, data, config);
  },

  // PUT 요청 (GitHub OAuth 인증 필요)
  put: async <T = any>(url: string, data?: any, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance.put<T>(url, data, config);
  },

  // PATCH 요청 (GitHub OAuth 인증 필요)
  patch: async <T = any>(url: string, data?: any, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance.patch<T>(url, data, config);
  },

  // DELETE 요청 (GitHub OAuth 인증 필요)
  delete: async <T = any>(url: string, config?: any) => {
    const { authInstance } = await import("./instances");
    return authInstance.delete<T>(url, config);
  },

  // 인증 없는 GET 요청
  getPublic: async <T = any>(url: string, config?: any) => {
    const { defaultInstance } = await import("./instances");
    return defaultInstance.get<T>(url, config);
  },

  // 인증 없는 POST 요청
  postPublic: async <T = any>(url: string, data?: any, config?: any) => {
    const { defaultInstance } = await import("./instances");
    return defaultInstance.post<T>(url, data, config);
  },
} as const;
