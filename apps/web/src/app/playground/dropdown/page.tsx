'use client';

import React, { useState } from 'react';
import { Dropdown } from '@/components/Dropdown';
import type { DropdownOption } from '@/components/Dropdown';
import styles from './page.module.scss';

export default function DropdownPlayground() {
  const [basicValue, setBasicValue] = useState('');
  const [multiValue, setMultiValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [iconValue, setIconValue] = useState('');

  // 기본 옵션
  const basicOptions: DropdownOption[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid.js' },
  ];

  // 아이콘이 있는 옵션
  const iconOptions: DropdownOption[] = [
    {
      value: 'javascript',
      label: 'JavaScript',
      description: '동적 웹 개발의 핵심 언어',
      icon: <span style={{ fontSize: '1.25rem' }}>🟨</span>,
    },
    {
      value: 'typescript',
      label: 'TypeScript',
      description: '타입 안정성을 제공하는 JS 슈퍼셋',
      icon: <span style={{ fontSize: '1.25rem' }}>🔷</span>,
    },
    {
      value: 'python',
      label: 'Python',
      description: '범용 프로그래밍 언어',
      icon: <span style={{ fontSize: '1.25rem' }}>🐍</span>,
    },
    {
      value: 'rust',
      label: 'Rust',
      description: '메모리 안전성과 성능',
      icon: <span style={{ fontSize: '1.25rem' }}>🦀</span>,
    },
    {
      value: 'go',
      label: 'Go',
      description: '간결하고 빠른 언어',
      icon: <span style={{ fontSize: '1.25rem' }}>🔵</span>,
    },
  ];

  // 많은 옵션 (검색 테스트용)
  const searchOptions: DropdownOption[] = [
    { value: 'apple', label: '🍎 Apple', description: '빨간 사과' },
    { value: 'banana', label: '🍌 Banana', description: '노란 바나나' },
    { value: 'cherry', label: '🍒 Cherry', description: '빨간 체리' },
    { value: 'grape', label: '🍇 Grape', description: '보라색 포도' },
    { value: 'orange', label: '🍊 Orange', description: '오렌지' },
    { value: 'strawberry', label: '🍓 Strawberry', description: '달콤한 딸기' },
    { value: 'watermelon', label: '🍉 Watermelon', description: '수박' },
    { value: 'pineapple', label: '🍍 Pineapple', description: '파인애플' },
    { value: 'mango', label: '🥭 Mango', description: '망고' },
    { value: 'avocado', label: '🥑 Avocado', description: '아보카도' },
  ];

  // 그룹화된 옵션
  const groupedOptions: DropdownOption[] = [
    { value: 'react', label: 'React', description: 'Facebook' },
    { value: 'vue', label: 'Vue.js', description: 'Evan You' },
    { value: 'angular', label: 'Angular', description: 'Google' },
    { value: 'divider1', label: '', divider: true },
    { value: 'express', label: 'Express', description: 'Node.js' },
    { value: 'fastify', label: 'Fastify', description: 'Node.js' },
    { value: 'nest', label: 'NestJS', description: 'Node.js' },
    { value: 'divider2', label: '', divider: true },
    { value: 'mongodb', label: 'MongoDB', description: 'NoSQL' },
    { value: 'postgresql', label: 'PostgreSQL', description: 'SQL' },
    { value: 'redis', label: 'Redis', description: 'Cache' },
  ];

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <h1>🎨 Dropdown 컴포넌트 플레이그라운드</h1>
        <p>다양한 스타일과 기능을 가진 드롭다운 컴포넌트입니다</p>
      </div>

      <div className={styles.grid}>
        {/* 기본 드롭다운 */}
        <section className={styles.section}>
          <h2>기본 드롭다운</h2>
          <p className={styles.description}>
            가장 기본적인 형태의 드롭다운입니다.
          </p>
          <Dropdown
            options={basicOptions}
            value={basicValue}
            onChange={setBasicValue}
            placeholder="프레임워크를 선택하세요"
            label="프레임워크"
          />
          <div className={styles.output}>
            선택된 값: <code>{basicValue || '없음'}</code>
          </div>
        </section>

        {/* 아이콘 & 설명이 있는 드롭다운 */}
        <section className={styles.section}>
          <h2>아이콘 & 설명</h2>
          <p className={styles.description}>
            아이콘과 설명을 포함한 리치 옵션들입니다.
          </p>
          <Dropdown
            options={iconOptions}
            value={iconValue}
            onChange={setIconValue}
            placeholder="프로그래밍 언어 선택"
            label="프로그래밍 언어"
          />
          <div className={styles.output}>
            선택된 값: <code>{iconValue || '없음'}</code>
          </div>
        </section>

        {/* 검색 가능한 드롭다운 */}
        <section className={styles.section}>
          <h2>검색 가능</h2>
          <p className={styles.description}>
            많은 옵션 중에서 검색해서 찾을 수 있습니다.
          </p>
          <Dropdown
            options={searchOptions}
            value={searchValue}
            onChange={setSearchValue}
            searchable
            placeholder="과일을 검색하세요"
            label="좋아하는 과일"
          />
          <div className={styles.output}>
            선택된 값: <code>{searchValue || '없음'}</code>
          </div>
        </section>

        {/* 다중 선택 */}
        <section className={styles.section}>
          <h2>다중 선택</h2>
          <p className={styles.description}>
            여러 개의 옵션을 선택할 수 있습니다.
          </p>
          <Dropdown
            options={basicOptions}
            value={multiValue}
            onChange={setMultiValue}
            multiple
            placeholder="여러 프레임워크 선택"
            label="선호하는 프레임워크들"
          />
          <div className={styles.output}>
            선택된 값: <code>{multiValue || '없음'}</code>
          </div>
        </section>

        {/* 그룹화된 옵션 */}
        <section className={styles.section}>
          <h2>그룹화된 옵션</h2>
          <p className={styles.description}>
            구분선으로 옵션들을 그룹화할 수 있습니다.
          </p>
          <Dropdown
            options={groupedOptions}
            placeholder="기술 스택 선택"
            label="기술 스택"
          />
        </section>

        {/* 크기 변형 */}
        <section className={styles.section}>
          <h2>다양한 크기</h2>
          <div className={styles.sizeVariants}>
            <Dropdown
              options={basicOptions}
              size="small"
              placeholder="Small"
              label="Small"
            />
            <Dropdown
              options={basicOptions}
              size="medium"
              placeholder="Medium (기본)"
              label="Medium"
            />
            <Dropdown
              options={basicOptions}
              size="large"
              placeholder="Large"
              label="Large"
            />
          </div>
        </section>

        {/* 스타일 변형 */}
        <section className={styles.section}>
          <h2>다양한 스타일</h2>
          <div className={styles.styleVariants}>
            <Dropdown
              options={basicOptions}
              variant="default"
              placeholder="Default"
              label="Default"
            />
            <Dropdown
              options={basicOptions}
              variant="outlined"
              placeholder="Outlined"
              label="Outlined"
            />
            <Dropdown
              options={basicOptions}
              variant="filled"
              placeholder="Filled"
              label="Filled"
            />
          </div>
        </section>

        {/* 클리어 가능 */}
        <section className={styles.section}>
          <h2>클리어 가능</h2>
          <p className={styles.description}>
            X 버튼을 클릭해서 선택을 취소할 수 있습니다.
          </p>
          <Dropdown
            options={basicOptions}
            placeholder="선택하세요"
            label="프레임워크"
            clearable
          />
        </section>

        {/* 비활성화 & 에러 */}
        <section className={styles.section}>
          <h2>상태 변형</h2>
          <div className={styles.stateVariants}>
            <Dropdown
              options={basicOptions}
              disabled
              placeholder="비활성화됨"
              label="비활성화"
            />
            <Dropdown
              options={basicOptions}
              placeholder="필수 항목"
              label="필수 항목"
              required
              error="이 항목은 필수입니다"
            />
          </div>
        </section>

        {/* 다중 선택 + 검색 */}
        <section className={styles.section}>
          <h2>다중 선택 + 검색</h2>
          <p className={styles.description}>
            검색하면서 여러 개를 선택할 수 있습니다.
          </p>
          <Dropdown
            options={searchOptions}
            multiple
            searchable
            placeholder="여러 과일 선택"
            label="좋아하는 과일들"
            clearable
          />
        </section>
      </div>

      {/* 코드 예제 */}
      <section className={styles.codeSection}>
        <h2>📝 사용 예제</h2>
        <pre className={styles.code}>
          {`import { Dropdown } from '@/components/Dropdown';

// 기본 사용법
<Dropdown
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="선택하세요"
  label="프레임워크"
/>

// 아이콘과 설명이 있는 옵션
<Dropdown
  options={[
    {
      value: 'ts',
      label: 'TypeScript',
      description: '타입 안정성',
      icon: <Icon />
    },
  ]}
  searchable
  clearable
/>

// 다중 선택
<Dropdown
  options={options}
  multiple
  searchable
  placeholder="여러 개 선택"
/>`}
        </pre>
      </section>
    </div>
  );
}

