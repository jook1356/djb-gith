import { useState } from "react";
import { apiHelpers, api, getCookie, setCookie } from "./index";

// ========================================
// 사용 예제 모음
// ========================================

/**
 * 사용자 정보 관련 API 예제 (GitHub OAuth 사용)
 */
export const userExamples = {
  // GitHub 사용자 정보 가져오기
  getGitHubProfile: async () => {
    try {
      const response = await apiHelpers.get("/auth/user");
      return response.data;
    } catch (error) {
      console.error("GitHub 프로필 조회 실패:", error);
      throw error;
    }
  },

  // 블로그 프로필 설정 업데이트
  updateBlogProfile: async (profileData: {
    display_name?: string;
    bio?: string;
    website?: string;
  }) => {
    try {
      const response = await apiHelpers.put("/user/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("블로그 프로필 업데이트 실패:", error);
      throw error;
    }
  },

  // 공개 사용자 목록 조회
  getPublicUsers: async () => {
    try {
      const response = await apiHelpers.getPublic("/users/public");
      return response.data;
    } catch (error) {
      console.error("사용자 목록 조회 실패:", error);
      throw error;
    }
  },
};

/**
 * GitHub OAuth 인증 관련 API 예제
 * 주의: 실제 인증은 useAuth Hook을 사용하세요.
 */
export const authExamples = {
  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    try {
      const response = await apiHelpers.get("/auth/user");
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // GitHub OAuth는 useAuth Hook에서 처리됩니다
  // 직접 API로 로그인/로그아웃하지 마세요
  note: "GitHub OAuth 인증은 useAuth Hook과 AuthProvider를 사용하세요",
};

/**
 * 파일 업로드 관련 API 예제
 */
export const fileExamples = {
  // 블로그 이미지 업로드 (GitHub OAuth 인증 필요)
  uploadBlogImage: async (file: File, alt?: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "blog-image");
      if (alt) {
        formData.append("alt", alt);
      }

      const response = await api.formDataAuth("/blog/upload/image", formData);
      return response.data;
    } catch (error) {
      console.error("블로그 이미지 업로드 실패:", error);
      throw error;
    }
  },

  // 블로그 첨부파일 업로드 (GitHub OAuth 인증 필요)
  uploadAttachment: async (file: File, description?: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "attachment");
      if (description) {
        formData.append("description", description);
      }

      const response = await api.formDataAuth(
        "/blog/upload/attachment",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("첨부파일 업로드 실패:", error);
      throw error;
    }
  },

  // 공개 파일 업로드 (인증 불필요) - 제한적 사용
  uploadPublicFile: async (file: File, description?: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (description) {
        formData.append("description", description);
      }

      const response = await api.formData("/blog/upload/public", formData);
      return response.data;
    } catch (error) {
      console.error("공개 파일 업로드 실패:", error);
      throw error;
    }
  },
};

/**
 * 블로그 게시물 관련 API 예제
 */
export const postExamples = {
  // 공개 게시물 목록 조회
  getPublicPosts: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiHelpers.getPublic(
        `/blog/posts?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("게시물 목록 조회 실패:", error);
      throw error;
    }
  },

  // 특정 게시물 조회
  getPost: async (postId: string) => {
    try {
      const response = await apiHelpers.getPublic(`/blog/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("게시물 조회 실패:", error);
      throw error;
    }
  },

  // 새 블로그 게시물 작성 (GitHub OAuth 인증 필요)
  createPost: async (postData: {
    title: string;
    content: string;
    tags?: string[];
    published?: boolean;
  }) => {
    try {
      const response = await apiHelpers.post("/blog/posts", postData);
      return response.data;
    } catch (error) {
      console.error("게시물 작성 실패:", error);
      throw error;
    }
  },

  // 게시물 수정 (GitHub OAuth 인증 필요)
  updatePost: async (
    postId: string,
    postData: {
      title?: string;
      content?: string;
      tags?: string[];
      published?: boolean;
    }
  ) => {
    try {
      const response = await apiHelpers.put(`/blog/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error("게시물 수정 실패:", error);
      throw error;
    }
  },

  // 게시물 삭제 (GitHub OAuth 인증 필요)
  deletePost: async (postId: string) => {
    try {
      const response = await apiHelpers.delete(`/blog/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      throw error;
    }
  },

  // 내가 작성한 게시물 목록 조회 (GitHub OAuth 인증 필요)
  getMyPosts: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiHelpers.get(
        `/blog/posts/my?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("내 게시물 목록 조회 실패:", error);
      throw error;
    }
  },
};

/**
 * React Hook에서 사용하는 예제
 */
export const hookExamples = {
  // Custom Hook 예제
  useUser: () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userData = await userExamples.getGitHubProfile();
        setUser(userData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    return { user, loading, error, fetchUser };
  },
};

// 타입 정의 예제 (GitHub OAuth 기반 블로그)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  published: boolean;
  slug: string;
  author: {
    login: string;
    avatar_url: string;
    name?: string;
  };
  created_at: string;
  updated_at: string;
  published_at?: string;
  view_count?: number;
}

export interface BlogProfile {
  user_id: number;
  display_name?: string;
  bio?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}
