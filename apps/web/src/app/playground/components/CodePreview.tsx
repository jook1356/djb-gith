"use client";

import { useState } from 'react';
import styles from './CodePreview.module.scss';

export function CodePreview() {
  const [activeExample, setActiveExample] = useState('react-component');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const codeExamples = [
    {
      id: 'react-component',
      title: 'React 컴포넌트',
      description: '함수형 컴포넌트와 hooks 사용 예제',
      language: 'tsx',
      code: `import React, { useState, useEffect } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick?.();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      className={\`\${styles.button} \${styles[variant]} \${styles[size]}\`}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? '로딩 중...' : children}
    </button>
  );
};`
    },
    {
      id: 'custom-hook',
      title: 'Custom Hook',
      description: 'API 호출을 위한 커스텀 훅 예제',
      language: 'ts',
      code: `import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}`
    },
    {
      id: 'scss-mixin',
      title: 'SCSS Mixins',
      description: '재사용 가능한 SCSS 믹스인 예제',
      language: 'scss',
      code: `// 반응형 브레이크포인트 믹스인
@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 767px) { @content; }
  }
  @if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1023px) { @content; }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) { @content; }
  }
}

// 플렉스 센터 정렬 믹스인
@mixin flex-center($direction: row) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: $direction;
}

// 그라데이션 배경 믹스인
@mixin gradient-bg($start, $end, $direction: 135deg) {
  background: linear-gradient($direction, $start, $end);
}

// 카드 스타일 믹스인
@mixin card-style($padding: 1rem, $radius: 8px) {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $radius;
  padding: $padding;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

// 사용 예제
.button {
  @include flex-center;
  @include gradient-bg(#3b82f6, #1d4ed8);
  
  @include responsive(mobile) {
    width: 100%;
  }
}

.card {
  @include card-style(1.5rem, 12px);
}`
    },
    {
      id: 'typescript-types',
      title: 'TypeScript Types',
      description: '복잡한 타입 정의 예제',
      language: 'ts',
      code: `// 유틸리티 타입 활용
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
};

// 조건부 타입
type NonNullable<T> = T extends null | undefined ? never : T;

// 매핑된 타입
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 템플릿 리터럴 타입
type Theme = 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';
type ButtonClass = \`btn-\${Theme}-\${Size}\`;

// 함수 오버로드
interface EventEmitter {
  on(event: 'data', listener: (data: string) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'close', listener: () => void): void;
}

// 제네릭 제약 조건
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 인덱스 시그니처
interface StringDictionary {
  [key: string]: string;
}

// 키 추출 타입
type UserKeys = keyof User; // 'id' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt'
type UserName = Pick<User, 'name'>; // { name: string }
type UserWithoutId = Omit<User, 'id'>; // User without id property`
    }
  ];

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const activeCode = codeExamples.find(example => example.id === activeExample);

  return (
    <div className={styles.codePreview}>
      <div className={styles.header}>
        <h2 className={styles.title}>코드 프리뷰</h2>
        <p className={styles.description}>
          실제 프로젝트에서 사용되는 코드 패턴과 예제들을 확인해보세요.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.exampleTabs}>
          {codeExamples.map((example) => (
            <button
              key={example.id}
              className={`${styles.tab} ${activeExample === example.id ? styles.active : ''}`}
              onClick={() => setActiveExample(example.id)}
            >
              <div className={styles.tabContent}>
                <div className={styles.tabTitle}>{example.title}</div>
                <div className={styles.tabLanguage}>{example.language.toUpperCase()}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeCode && (
        <div className={styles.codeContainer}>
          <div className={styles.codeHeader}>
            <div className={styles.codeInfo}>
              <h3 className={styles.codeTitle}>{activeCode.title}</h3>
              <p className={styles.codeDescription}>{activeCode.description}</p>
            </div>
            <button
              className={`${styles.copyButton} ${copiedCode === activeCode.code ? styles.copied : ''}`}
              onClick={() => copyCode(activeCode.code)}
            >
              {copiedCode === activeCode.code ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  복사하기
                </>
              )}
            </button>
          </div>
          
          <div className={styles.codeBlock}>
            <div className={styles.codeWindow}>
              <div className={styles.windowHeader}>
                <div className={styles.windowControls}>
                  <span className={styles.windowControl}></span>
                  <span className={styles.windowControl}></span>
                  <span className={styles.windowControl}></span>
                </div>
                <div className={styles.fileName}>
                  example.{activeCode.language === 'tsx' ? 'tsx' : 
                           activeCode.language === 'ts' ? 'ts' : 
                           activeCode.language === 'scss' ? 'scss' : 'js'}
                </div>
              </div>
              <pre className={styles.code}>
                <code className={`language-${activeCode.language}`}>
                  {activeCode.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <p className={styles.tip}>
          <svg className={styles.tipIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          코드를 클릭하여 클립보드에 복사할 수 있습니다. 실제 프로젝트에서 활용해보세요!
        </p>
      </div>
    </div>
  );
}
