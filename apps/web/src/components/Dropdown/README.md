# 🎯 Dropdown 컴포넌트

현대적이고 기능이 풍부한 드롭다운 컴포넌트입니다. 다양한 스타일, 크기, 그리고 강력한 기능들을 제공합니다.

## ✨ 주요 기능

- 🎨 **다양한 스타일**: Default, Outlined, Filled 변형
- 📏 **여러 크기**: Small, Medium, Large
- 🔍 **검색 기능**: 많은 옵션에서 빠르게 찾기
- ✅ **다중 선택**: 체크박스로 여러 옵션 선택
- 🎯 **키보드 네비게이션**: 완전한 접근성 지원
- 🖼️ **아이콘 지원**: 옵션에 아이콘 추가
- 📝 **설명 텍스트**: 각 옵션에 설명 추가
- 🎭 **부드러운 애니메이션**: 멋진 트랜지션 효과
- 🌓 **다크 모드**: 라이트/다크 테마 지원
- ♿ **접근성**: ARIA 속성과 키보드 지원
- 📱 **반응형**: 모바일 친화적

## 📦 설치 및 사용

```tsx
import { Dropdown } from '@/components/Dropdown';
import type { DropdownOption } from '@/components/Dropdown';
```

## 🚀 기본 사용법

```tsx
const [value, setValue] = useState('');

const options: DropdownOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
];

<Dropdown
  options={options}
  value={value}
  onChange={setValue}
  placeholder="프레임워크를 선택하세요"
  label="프레임워크"
/>
```

## 🎨 고급 사용법

### 아이콘과 설명이 있는 옵션

```tsx
const options: DropdownOption[] = [
  {
    value: 'typescript',
    label: 'TypeScript',
    description: '타입 안정성을 제공하는 JavaScript 슈퍼셋',
    icon: <TypeScriptIcon />,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    description: '웹 개발의 핵심 언어',
    icon: <JavaScriptIcon />,
  },
];

<Dropdown
  options={options}
  label="프로그래밍 언어"
  clearable
/>
```

### 검색 가능한 드롭다운

```tsx
<Dropdown
  options={manyOptions}
  searchable
  placeholder="검색하여 찾기..."
  label="국가 선택"
/>
```

### 다중 선택

```tsx
<Dropdown
  options={options}
  multiple
  onChange={(value) => console.log(value.split(','))}
  placeholder="여러 개 선택 가능"
  label="기술 스택"
/>
```

### 다중 선택 + 검색

```tsx
<Dropdown
  options={options}
  multiple
  searchable
  clearable
  placeholder="검색하고 여러 개 선택"
  label="관심 분야"
/>
```

### 그룹화된 옵션

```tsx
const options: DropdownOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'divider1', label: '', divider: true },
  { value: 'node', label: 'Node.js' },
  { value: 'deno', label: 'Deno' },
];

<Dropdown options={options} />
```

### 다양한 크기

```tsx
<Dropdown options={options} size="small" />
<Dropdown options={options} size="medium" />
<Dropdown options={options} size="large" />
```

### 다양한 스타일

```tsx
<Dropdown options={options} variant="default" />
<Dropdown options={options} variant="outlined" />
<Dropdown options={options} variant="filled" />
```

### 에러 상태

```tsx
<Dropdown
  options={options}
  required
  error="이 항목은 필수입니다"
  label="필수 항목"
/>
```

### 비활성화

```tsx
<Dropdown
  options={options}
  disabled
  placeholder="비활성화됨"
/>
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `DropdownOption[]` | **필수** | 드롭다운 옵션 배열 |
| `value` | `string` | `undefined` | 선택된 값 |
| `onChange` | `(value: string) => void` | `undefined` | 값 변경 핸들러 |
| `placeholder` | `string` | `'옵션을 선택하세요'` | 플레이스홀더 텍스트 |
| `label` | `string` | `undefined` | 라벨 텍스트 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `searchable` | `boolean` | `false` | 검색 기능 활성화 |
| `multiple` | `boolean` | `false` | 다중 선택 가능 |
| `clearable` | `boolean` | `false` | 클리어 버튼 표시 |
| `required` | `boolean` | `false` | 필수 항목 표시 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 크기 |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | 스타일 변형 |
| `maxHeight` | `number` | `300` | 드롭다운 메뉴 최대 높이 (px) |
| `error` | `string` | `undefined` | 에러 메시지 |

## 🎯 DropdownOption 인터페이스

```typescript
interface DropdownOption {
  value: string;           // 옵션 값
  label: string;           // 표시될 텍스트
  icon?: React.ReactNode;  // 아이콘 (선택)
  description?: string;    // 설명 텍스트 (선택)
  disabled?: boolean;      // 비활성화 여부 (선택)
  divider?: boolean;       // 구분선으로 사용 (선택)
}
```

## ⌨️ 키보드 단축키

- `Enter` / `Space`: 드롭다운 열기/옵션 선택
- `Escape`: 드롭다운 닫기
- `Arrow Down`: 다음 옵션으로 이동
- `Arrow Up`: 이전 옵션으로 이동

## 🎨 커스터마이징

컴포넌트는 CSS 변수를 사용하여 쉽게 커스터마이징할 수 있습니다:

```scss
// globals.scss에서 정의된 변수들
--color-surface
--color-surface-secondary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border
--color-border-light
--color-primary
--color-primary-hover
--color-primary-light
```

## 🌟 실전 예제

### 폼에서 사용하기

```tsx
function MyForm() {
  const [formData, setFormData] = useState({
    framework: '',
    language: '',
    skills: '',
  });

  return (
    <form>
      <Dropdown
        options={frameworkOptions}
        value={formData.framework}
        onChange={(value) => setFormData({ ...formData, framework: value })}
        label="선호하는 프레임워크"
        required
        error={!formData.framework ? '프레임워크를 선택해주세요' : undefined}
      />

      <Dropdown
        options={languageOptions}
        value={formData.language}
        onChange={(value) => setFormData({ ...formData, language: value })}
        label="주 사용 언어"
        searchable
        clearable
      />

      <Dropdown
        options={skillOptions}
        value={formData.skills}
        onChange={(value) => setFormData({ ...formData, skills: value })}
        label="보유 기술"
        multiple
        searchable
      />
    </form>
  );
}
```

## 🎮 플레이그라운드

더 많은 예제와 라이브 데모를 보려면 플레이그라운드 페이지를 방문하세요:

```
/playground/dropdown
```

## 💡 팁

1. **많은 옵션이 있을 때**: `searchable` 속성을 사용하세요
2. **여러 개 선택**: `multiple`과 `searchable`을 함께 사용하면 좋습니다
3. **사용자 경험**: `clearable` 속성으로 선택 취소를 쉽게 만드세요
4. **접근성**: 항상 `label` 속성을 제공하세요
5. **성능**: 옵션이 100개 이상이면 가상 스크롤 고려

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다.

## 📝 라이센스

MIT

---

Made with ❤️ by Your Team

