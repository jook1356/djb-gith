'use client';

import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

// GitHub Pages용 단순한 AuthProvider
export default function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
