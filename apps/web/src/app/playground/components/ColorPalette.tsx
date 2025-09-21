"use client";

import { useState } from 'react';
import styles from './ColorPalette.module.scss';

export function ColorPalette() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorPalettes = [
    {
      name: 'Primary Colors',
      colors: [
        { name: 'Blue', value: '#3b82f6', css: 'var(--color-primary)' },
        { name: 'Blue Light', value: '#dbeafe', css: 'var(--color-primary-light)' },
        { name: 'Blue Hover', value: '#2563eb', css: 'var(--color-primary-hover)' }
      ]
    },
    {
      name: 'Accent Colors',
      colors: [
        { name: 'Green', value: '#20c997', css: '--color-green' },
        { name: 'Yellow', value: '#fbbf24', css: '--color-yellow' },
        { name: 'Red', value: '#ef4444', css: '--color-red' },
        { name: 'Purple', value: '#8b5cf6', css: '--color-purple' },
        { name: 'Pink', value: '#ec4899', css: '--color-pink' },
        { name: 'Orange', value: '#f97316', css: '--color-orange' }
      ]
    },
    {
      name: 'Text Colors',
      colors: [
        { name: 'Primary Text', value: '#1f2937', css: 'var(--color-text-primary)' },
        { name: 'Secondary Text', value: '#6b7280', css: 'var(--color-text-secondary)' },
        { name: 'Tertiary Text', value: '#9ca3af', css: 'var(--color-text-tertiary)' }
      ]
    },
    {
      name: 'Background Colors',
      colors: [
        { name: 'Background', value: '#ffffff', css: 'var(--background)' },
        { name: 'Surface', value: '#f9fafb', css: 'var(--color-surface)' },
        { name: 'Surface Secondary', value: '#f3f4f6', css: 'var(--color-surface-secondary)' }
      ]
    }
  ];

  const copyToClipboard = async (color: { name: string; value: string; css: string }) => {
    try {
      await navigator.clipboard.writeText(color.value);
      setCopiedColor(color.value);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div className={styles.colorPalette}>
      <div className={styles.header}>
        <h2 className={styles.title}>색상 팔레트</h2>
        <p className={styles.description}>
          프로젝트에서 사용되는 색상들을 확인하고 복사할 수 있습니다.
        </p>
      </div>

      <div className={styles.palettes}>
        {colorPalettes.map((palette, index) => (
          <div key={index} className={styles.paletteGroup}>
            <h3 className={styles.paletteTitle}>{palette.name}</h3>
            <div className={styles.colorGrid}>
              {palette.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className={styles.colorCard}
                  onClick={() => copyToClipboard(color)}
                >
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color.value }}
                  >
                    {copiedColor === color.value && (
                      <div className={styles.copiedIndicator}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.colorInfo}>
                    <div className={styles.colorName}>{color.name}</div>
                    <div className={styles.colorValue}>{color.value}</div>
                    <div className={styles.colorCss}>{color.css}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.tip}>
          💡 색상 카드를 클릭하면 HEX 값이 클립보드에 복사됩니다.
        </p>
      </div>
    </div>
  );
}
