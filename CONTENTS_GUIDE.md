# Contents 폴더 구조 및 관리 가이드

> GitHub Pages를 위한 게시글 저장소 설계 및 운영 가이드

## 📋 목차

1. [개요](#개요)
2. [전체 폴더 구조](#전체-폴더-구조)
3. [게시판 명명 규칙](#게시판-명명-규칙)
4. [게시글 폴더 명명 규칙](#게시글-폴더-명명-규칙)
5. [메타데이터 구조](#메타데이터-구조)
6. [설정 파일 관리](#설정-파일-관리)
7. [특수문자 처리](#특수문자-처리)
8. [검색 최적화](#검색-최적화)
9. [구현 예시](#구현-예시)
10. [실제 사용 사례](#실제-사용-사례)

## 📖 개요

`contents` 폴더는 GitHub 서브모듈로 관리되는 별도 레포지토리로, GitHub Pages 빌드를 위한 게시글들을 저장합니다. 이 가이드는 확장성, 검색 최적화, 그리고 관리 편의성을 모두 고려한 구조를 제시합니다.

## 🗂️ 전체 폴더 구조

```
contents/
├── boards-config.json              # 전역 게시판 설정
├── boards/
│   ├── frontend/                   # 프론트엔드 게시판
│   │   ├── _config.json           # 게시판별 개별 설정
│   │   ├── 2024-01-15_1430_react-hooks-guide_a1b2c3d4/
│   │   │   ├── index.md           # 메인 콘텐츠
│   │   │   ├── meta.json          # 게시글 메타데이터
│   │   │   └── assets/            # 이미지, 첨부파일 등
│   │   │       ├── diagram.png
│   │   │       └── screenshot.jpg
│   │   └── 2024-01-16_0900_vue-composition-api_e5f6g7h8/
│   │       ├── index.md
│   │       ├── meta.json
│   │       └── assets/
│   ├── backend/                    # 백엔드 게시판
│   │   ├── _config.json
│   │   └── 2024-01-15_1600_nodejs-best-practices_i9j0k1l2/
│   │       ├── index.md
│   │       ├── meta.json
│   │       └── assets/
│   ├── tutorial/                   # 튜토리얼 게시판
│   ├── project-showcase/           # 프로젝트 쇼케이스
│   ├── code-review/                # 코드 리뷰
│   └── general/                    # 일반 게시판
└── templates/
    ├── post-template.md            # 게시글 템플릿
    └── meta-template.json          # 메타데이터 템플릿
```

## 📝 게시판 명명 규칙

### 원칙

- **영문 소문자** + **하이픈(-)**만 사용
- 특수문자 완전 제거
- URL과 GitHub Search에 최적화

### 예시

```bash
frontend/              # ✅ 권장
backend/               # ✅ 권장
web-development/       # ✅ 권장
data-science/          # ✅ 권장
project-showcase/      # ✅ 권장

Frontend/              # ❌ 대문자 사용
web_development/       # ❌ 언더스코어 사용
data&science/          # ❌ 특수문자 사용
```

### 게시판명 생성 함수

```javascript
function createBoardName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // 특수문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-"); // 연속 하이픈 정리
}
```

## 📁 게시글 폴더 명명 규칙

### 패턴: `{날짜}_{시간}_{제목}_{해시}`

```
2024-01-15_1430_react-hooks-완벽-가이드_a1b2c3d4
```

#### 구성 요소

- **날짜**: `YYYY-MM-DD` 형식
- **시간**: `HHMM` 형식 (24시간)
- **제목**: sanitized 제목 (특수문자 제거)
- **해시**: 8자리 UUID 앞부분 (고유성 보장)

#### 구분자

- `_` (언더스코어): 주요 구성 요소 간 구분
- `-` (하이픈): 제목 내 단어 간 구분

### 폴더명 생성 함수

```javascript
function generatePostFolder(title, date = new Date()) {
  const dateStr = date.toISOString().split("T")[0];
  const timeStr = date.toTimeString().slice(0, 5).replace(":", "");

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, "") // 특수문자 제거 (한글 허용)
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속 하이픈 정리
    .slice(0, 40); // 길이 제한

  const shortHash = crypto.randomUUID().split("-")[0]; // 8자리

  return `${dateStr}_${timeStr}_${slug}_${shortHash}`;
}
```

### 폴더명 파싱 함수

```javascript
function parsePostFolder(folderName) {
  const [date, time, ...titleAndHash] = folderName.split("_");
  const hash = titleAndHash.pop();
  const title = titleAndHash.join("_");

  return {
    date, // "2024-01-15"
    time, // "1430"
    title, // "react-hooks-완벽-가이드"
    hash, // "a1b2c3d4"
  };
}
```

## 📊 메타데이터 구조

### `meta.json` 템플릿

```json
{
  "id": "2024-01-15_1430_react-hooks-guide_a1b2c3d4",
  "title": "React Hooks 완벽 가이드",
  "slug": "react-hooks-complete-guide",
  "description": "useState, useEffect 등 React Hooks 사용법 완전 정리",
  "author": "김동주",
  "board": "frontend",
  "createdAt": "2024-01-15T14:30:00+09:00",
  "updatedAt": "2024-01-16T10:15:00+09:00",
  "published": true,
  "featured": false,
  "tags": ["React", "JavaScript", "Frontend", "Hooks"],
  "categories": ["Tutorial", "Advanced"],
  "difficulty": "Intermediate",
  "readTime": 8,
  "language": "ko",
  "thumbnail": "assets/react-hooks-thumb.jpg",
  "seo": {
    "metaTitle": "React Hooks 완벽 가이드 - 실무에서 바로 쓰는 패턴들",
    "metaDescription": "React Hooks의 모든 것을 담은 완벽 가이드. useState, useEffect부터 커스텀 훅까지",
    "keywords": ["React", "Hooks", "useState", "useEffect", "커스텀훅"]
  },
  "stats": {
    "views": 0,
    "likes": 0,
    "shares": 0
  }
}
```

## ⚙️ 설정 파일 관리

### 하이브리드 방식 채택

- **전역 설정**: `boards-config.json` (공통 기본값 및 사이트 전역 설정)
- **개별 설정**: 각 게시판의 `_config.json` (게시판 메타정보 및 개별 설정)

### 전역 설정 (`boards-config.json`)

```json
{
  "defaultSettings": {
    "allowComments": true,
    "showAuthor": true,
    "showDate": true,
    "pagination": 10,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  },
  "siteWide": {
    "theme": "dark",
    "language": "ko",
    "timezone": "Asia/Seoul"
  }
}
```

### 개별 게시판 설정 (`frontend/_config.json`)

```json
{
  "extends": "defaultSettings",
  "boardInfo": {
    "displayName": "Frontend",
    "description": "프론트엔드 개발 관련",
    "icon": "🎨",
    "enabled": true
  },
  "overrides": {
    "featuredPostsCount": 3,
    "showTags": true,
    "allowComments": true
  },
  "customFields": {
    "techStack": ["React", "Vue", "Angular", "Svelte"],
    "difficulty": ["Beginner", "Intermediate", "Advanced", "Expert"],
    "postTemplate": "frontend-template.md"
  },
  "seo": {
    "metaDescription": "프론트엔드 개발 관련 최신 정보와 튜토리얼",
    "keywords": ["Frontend", "React", "Vue", "JavaScript", "CSS"]
  },
  "autoGenerate": {
    "tableOfContents": true,
    "readingTime": true,
    "relatedPosts": 3
  }
}
```

### 다른 게시판 예시 (`backend/_config.json`)

```json
{
  "extends": "defaultSettings",
  "boardInfo": {
    "displayName": "Backend",
    "description": "백엔드 개발 관련",
    "icon": "⚙️",
    "enabled": true
  },
  "overrides": {
    "featuredPostsCount": 2,
    "showTags": true,
    "allowComments": true
  },
  "customFields": {
    "techStack": ["Node.js", "Python", "Java", "Go"],
    "difficulty": ["Beginner", "Intermediate", "Advanced"],
    "postTemplate": "backend-template.md"
  },
  "seo": {
    "metaDescription": "백엔드 개발, 서버 아키텍처, API 설계 관련 정보",
    "keywords": ["Backend", "Server", "API", "Database", "Architecture"]
  }
}
```

### 설정 병합 로직

```javascript
async function getBoardConfig(boardName) {
  // 1. 전역 설정 로드
  const globalConfig = await loadJSON("boards-config.json");

  // 2. 개별 설정 로드
  const boardConfig = await loadJSON(`boards/${boardName}/_config.json`);

  // 3. 설정 병합
  return {
    ...globalConfig.defaultSettings,
    ...boardConfig.boardInfo,
    ...boardConfig.overrides,
    customFields: boardConfig.customFields || {},
    seo: boardConfig.seo || {},
    autoGenerate: boardConfig.autoGenerate || {},
  };
}
```

### 이 구조의 장점들

#### ✅ **완전한 모듈화**

- 각 게시판이 자체 메타정보를 포함하여 완전히 독립적
- 게시판 추가/삭제 시 해당 폴더만 관리하면 됨

#### ✅ **동시 작업 친화적**

- 여러 사람이 동시에 다른 게시판 설정을 수정 가능
- Git 충돌 위험 최소화

#### ✅ **확장성**

- 새로운 게시판의 고유한 설정을 자유롭게 추가
- 전역 설정 파일이 비대해지지 않음

#### ✅ **일관성 유지**

- 전역 설정으로 공통 기본값은 여전히 일관성 있게 관리
- 사이트 전역 설정(테마, 언어 등)은 중앙에서 관리

## 🔧 특수문자 처리

### 원칙

모든 특수문자는 **제거하거나 안전한 문자로 치환**

### 처리 방식

```javascript
function sanitizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, "") // 특수문자 제거 (한글 허용)
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속 하이픈 정리
    .trim("-"); // 앞뒤 하이픈 제거
}
```

### 변환 예시

| 원본 제목                    | 변환 결과                |
| ---------------------------- | ------------------------ |
| `"React & Vue: 완벽 비교!"`  | `react-vue-완벽-비교`    |
| `"TypeScript Tips & Tricks"` | `typescript-tips-tricks` |
| `"Node.js vs Deno (2024년)"` | `nodejs-vs-deno-2024년`  |
| `"CSS-in-JS 완전정복"`       | `css-in-js-완전정복`     |

## 🔍 검색 최적화

### GitHub Search API 활용

```javascript
async function searchContents(query) {
  const searches = [
    // 1. 파일명 검색 (폴더명이 검색 키워드 역할)
    `repo:${repo}+filename:${query}+path:contents/boards`,

    // 2. 내용 검색
    `repo:${repo}+${query}+in:file+path:contents/boards`,

    // 3. 마크다운 파일 검색
    `repo:${repo}+${query}+extension:md+path:contents/boards`,
  ];

  const results = await Promise.all(
    searches.map((q) => fetch(`https://api.github.com/search/code?q=${q}`))
  );

  return mergeAndRankResults(results);
}
```

### SEO 최적화

- **의미있는 폴더명**: 검색 키워드가 폴더명에 포함됨
- **URL 친화적**: 하이픈으로 연결된 깔끔한 URL
- **메타데이터 활용**: 풍부한 SEO 정보

## 💻 구현 예시

### 새 게시글 생성

```javascript
async function createPost(boardName, title, content) {
  // 1. 폴더명 생성
  const folderName = generatePostFolder(title);
  const postPath = `contents/boards/${boardName}/${folderName}`;

  // 2. 폴더 생성
  await createDirectory(postPath);
  await createDirectory(`${postPath}/assets`);

  // 3. 메타데이터 생성
  const meta = {
    id: folderName,
    title: title,
    slug: sanitizeTitle(title),
    board: boardName,
    createdAt: new Date().toISOString(),
    published: false,
    tags: [],
    categories: [],
  };

  // 4. 파일 작성
  await writeFile(`${postPath}/meta.json`, JSON.stringify(meta, null, 2));
  await writeFile(`${postPath}/index.md`, `# ${title}\n\n${content}`);

  return folderName;
}
```

### 게시글 조회

```javascript
async function getPost(boardName, postId) {
  const postPath = `contents/boards/${boardName}/${postId}`;

  // 메타데이터와 콘텐츠를 동시에 로드
  const [meta, content] = await Promise.all([
    loadJSON(`${postPath}/meta.json`),
    loadMarkdown(`${postPath}/index.md`),
  ]);

  return {
    ...meta,
    content,
    path: postPath,
  };
}
```

### 게시판 목록 조회

```javascript
async function getBoardPosts(boardName, options = {}) {
  const boardPath = `contents/boards/${boardName}`;
  const folders = await listDirectories(boardPath);

  // _config.json 제외하고 게시글 폴더만
  const postFolders = folders.filter((f) => !f.startsWith("_"));

  const posts = await Promise.all(
    postFolders.map(async (folder) => {
      const meta = await loadJSON(`${boardPath}/${folder}/meta.json`);
      return meta;
    })
  );

  // 정렬 및 필터링
  return posts
    .filter(
      (post) =>
        options.published === undefined || post.published === options.published
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, options.limit || Infinity);
}
```

## 🎯 실제 사용 사례

### 1. 프론트엔드 기술 글 작성

```bash
# 폴더 구조
contents/boards/frontend/2024-01-15_1430_react-hooks-완벽-가이드_a1b2c3d4/
├── index.md
├── meta.json
└── assets/
    ├── hook-lifecycle.png
    ├── useState-example.gif
    └── custom-hook-demo.mp4
```

### 2. 튜토리얼 시리즈 관리

```bash
# 시리즈별 게시글들
contents/boards/tutorial/
├── 2024-01-10_1000_javascript-기초-01-변수와-타입_x1y2z3a4/
├── 2024-01-12_1000_javascript-기초-02-함수와-스코프_b5c6d7e8/
└── 2024-01-14_1000_javascript-기초-03-객체와-배열_f9g0h1i2/
```

### 3. 프로젝트 쇼케이스

```bash
# 프로젝트 소개 글
contents/boards/project-showcase/2024-01-20_1500_my-awesome-blog-platform_j3k4l5m6/
├── index.md              # 프로젝트 소개
├── meta.json
└── assets/
    ├── demo-screenshot.png
    ├── architecture-diagram.svg
    ├── demo-video.mp4
    └── source-code.zip
```

## 🚀 마이그레이션 가이드

기존 블로그에서 이 구조로 마이그레이션할 때:

1. **기존 게시글 분석**: 제목, 날짜, 카테고리 추출
2. **폴더명 변환**: 새로운 명명 규칙에 맞게 폴더명 생성
3. **메타데이터 생성**: 기존 정보를 바탕으로 `meta.json` 생성
4. **이미지 마이그레이션**: 모든 이미지를 `assets/` 폴더로 이동
5. **설정 파일 생성**: 게시판별 설정 파일 작성

## 📈 확장 계획

향후 추가할 수 있는 기능들:

- **다국어 지원**: `meta.json`에 언어별 제목/내용
- **버전 관리**: 게시글 수정 이력 추적
- **자동 백업**: Git hooks를 이용한 자동 백업
- **통계 수집**: 조회수, 좋아요, 공유 수 추적
- **댓글 시스템**: GitHub Discussions 연동
- **검색 인덱스**: 전문 검색을 위한 별도 인덱스 구축

---

## 📞 문의 및 개선사항

이 가이드에 대한 문의사항이나 개선 제안이 있다면 GitHub Issues를 통해 연락해 주세요.

**마지막 업데이트**: 2024-01-15  
**버전**: v1.0.0
