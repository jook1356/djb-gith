"use client";

import { useState } from 'react';
import Frame from '@/components/Frame/Frame';
import { ColorPalette } from './components/ColorPalette';
import { AnimationDemo } from './components/AnimationDemo';
import { InteractiveCards } from './components/InteractiveCards';
import { CodePreview } from './components/CodePreview';
import styles from './page.module.scss';

function Playground() {
  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    { id: 'colors', label: '색상 팔레트', icon: '🎨' },
    { id: 'animations', label: '애니메이션', icon: '✨' },
    { id: 'cards', label: '인터랙티브 카드', icon: '🃏' },
    { id: 'code', label: '코드 프리뷰', icon: '💻' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'colors':
        return <ColorPalette />;
      case 'animations':
        return <AnimationDemo />;
      case 'cards':
        return <InteractiveCards />;
      case 'code':
        return <CodePreview />;
      default:
        return <ColorPalette />;
    }
  };

  return (
    <Frame>
      <div className={styles.playground}>
        <div className={styles.header}>
          <h1 className={styles.title}>개발 놀이터</h1>
          <p className={styles.subtitle}>
            다양한 UI 컴포넌트와 인터랙션을 실험해보세요
          </p>
        </div>

        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {renderContent()}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export default Playground;
