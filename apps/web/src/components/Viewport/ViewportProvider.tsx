"use client";

import { useState, useEffect, ReactNode } from "react";
import { ViewportContext, Viewport } from "./ViewportContext";

interface ViewportProviderProps {
  children: ReactNode;
}

// 뷰포트 브레이크포인트 정의
const BREAKPOINTS = {
  mobile: 767, // 0 ~ 767px
  tablet: 1023, // 768 ~ 1023px
  desktop: 1024, // 1024px+
} as const;

const getViewportFromWidth = (width: number): Viewport => {
  if (width <= BREAKPOINTS.mobile) return "mobile";
  if (width <= BREAKPOINTS.tablet) return "tablet";
  return "desktop";
};

export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [mounted, setMounted] = useState(false);

  // 초기 뷰포트 설정
  useEffect(() => {
    const handleResize = () => {
      const currentViewport = getViewportFromWidth(window.innerWidth);
      setViewport(currentViewport);

      // HTML 엘리먼트에 data-viewport 속성 설정
      document.documentElement.setAttribute("data-viewport", currentViewport);
    };

    // 초기 실행
    handleResize();
    setMounted(true);

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 뷰포트 변경 시 data 속성 업데이트
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-viewport", viewport);
  }, [viewport, mounted]);

  // 뷰포트 로딩 완료 전까지는 기본값으로 렌더링
  const contextValue = {
    viewport,
    isMobile: viewport === "mobile",
    isTablet: viewport === "tablet",
    isDesktop: viewport === "desktop",
  };

  return (
    <ViewportContext.Provider value={contextValue}>
      {children}
    </ViewportContext.Provider>
  );
};
