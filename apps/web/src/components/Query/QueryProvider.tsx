'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Query Client 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      // 10분간 가비지 컬렉션 방지
      gcTime: 10 * 60 * 1000,
      // 네트워크 에러 시 3번 재시도
      retry: 3,
      // 재시도 간격 (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 윈도우 포커스 시 자동 refetch 비활성화 (GitHub API 호출 최소화)
      refetchOnWindowFocus: false,
      // 마운트 시 자동 refetch 비활성화
      refetchOnMount: false,
      // 재연결 시 자동 refetch 비활성화
      refetchOnReconnect: false,
    },
    mutations: {
      // 뮤테이션 에러 시 3번 재시도
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default QueryProvider;
