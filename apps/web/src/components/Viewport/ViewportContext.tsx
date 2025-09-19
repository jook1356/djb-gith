"use client";

import { createContext, useContext } from "react";

export type Viewport = "mobile" | "tablet" | "desktop";

export interface ViewportContextType {
  viewport: Viewport;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const ViewportContext = createContext<ViewportContextType | undefined>(
  undefined
);

export const useViewport = () => {
  const context = useContext(ViewportContext);

  if (context === undefined) {
    throw new Error(
      "useViewport은 ViewportProvider 내부에서 사용되어야 합니다"
    );
  }

  return context;
};
