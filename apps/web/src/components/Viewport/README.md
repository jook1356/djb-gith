# ViewportProvider

반응형 디자인을 위한 뷰포트 상태 관리 프로바이더입니다. 화면 크기에 따라 `data-viewport` 속성을 자동으로 설정하여 CSS에서 반응형 스타일링을 쉽게 할 수 있도록 도와줍니다.

## 기능

- 화면 크기 감지 및 뷰포트 타입 자동 분류
- `data-viewport` 속성을 HTML 루트 요소에 설정
- React 컨텍스트를 통한 뷰포트 상태 제공
- 윈도우 리사이즈 시 실시간 업데이트

## 뷰포트 분류

| 타입      | 화면 크기    | 설명            |
| --------- | ------------ | --------------- |
| `mobile`  | 0 ~ 767px    | 모바일 디바이스 |
| `tablet`  | 768 ~ 1023px | 태블릿 디바이스 |
| `desktop` | 1024px 이상  | 데스크톱/랩톱   |

## 설정

`layout.tsx`에 ViewportProvider를 추가:

```tsx
import { ViewportProvider } from "@/components/Viewport";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ViewportProvider>{children}</ViewportProvider>
      </body>
    </html>
  );
}
```

## React에서 사용법

```tsx
import { useViewport } from "@/components/Viewport";

function MyComponent() {
  const { viewport, isMobile, isTablet, isDesktop } = useViewport();

  return (
    <div>
      <p>현재 뷰포트: {viewport}</p>
      {isMobile && <p>모바일에서만 보이는 내용</p>}
      {isTablet && <p>태블릿에서만 보이는 내용</p>}
      {isDesktop && <p>데스크톱에서만 보이는 내용</p>}
    </div>
  );
}
```

## SCSS에서 사용법

### 기본 사용법

```scss
.my-component {
  padding: 16px;

  // 모바일에서만 적용
  :root[data-viewport="mobile"] & {
    padding: 8px;
    font-size: 14px;
  }

  // 태블릿에서만 적용
  :root[data-viewport="tablet"] & {
    padding: 12px;
    font-size: 16px;
  }

  // 데스크톱에서만 적용
  :root[data-viewport="desktop"] & {
    padding: 24px;
    font-size: 18px;
  }
}
```

### 복합 조건

```scss
.responsive-layout {
  // 모바일: 세로 배치
  :root[data-viewport="mobile"] & {
    flex-direction: column;
  }

  // 태블릿 이상: 가로 배치
  :root[data-viewport="tablet"] &,
  :root[data-viewport="desktop"] & {
    flex-direction: row;
  }
}
```

### 테마와 함께 사용

```scss
.theme-responsive {
  // 라이트 테마 + 모바일
  :root[data-theme="light"][data-viewport="mobile"] & {
    background: #f5f5f5;
    border-radius: 8px;
  }

  // 다크 테마 + 데스크톱
  :root[data-theme="dark"][data-viewport="desktop"] & {
    background: #2a2a2a;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
  }
}
```

### 유틸리티 클래스

```scss
// 특정 뷰포트에서만 보이기
.show-mobile-only {
  display: none;
  :root[data-viewport="mobile"] & {
    display: block;
  }
}

// 특정 뷰포트에서 숨기기
.hide-mobile {
  :root[data-viewport="mobile"] & {
    display: none !important;
  }
}
```

## API

### useViewport Hook

```typescript
interface ViewportContextType {
  viewport: "mobile" | "tablet" | "desktop";
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

### 속성

- `viewport`: 현재 뷰포트 타입
- `isMobile`: 모바일 뷰포트 여부
- `isTablet`: 태블릿 뷰포트 여부
- `isDesktop`: 데스크톱 뷰포트 여부

## 장점

1. **CSS 우선**: 미디어 쿼리 대신 `data-viewport` 속성 사용으로 더 명확한 조건부 스타일링
2. **테마와 조합**: `data-theme`과 함께 사용하여 복합 조건 스타일링 가능
3. **React 통합**: 컴포넌트에서도 뷰포트 상태에 접근 가능
4. **실시간 업데이트**: 윈도우 리사이즈 시 즉시 반영

## 예시 파일

더 많은 사용 예시는 `/src/styles/viewport-examples.scss` 파일을 참고하세요.
