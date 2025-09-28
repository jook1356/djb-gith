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
    { 
      id: 'colors', 
      label: '색상 팔레트', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <circle cx="12" cy="2" r="10"/>
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      )
    },
    { 
      id: 'animations', 
      label: '애니메이션', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      )
    },
    { 
      id: 'cards', 
      label: '인터랙티브 카드', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="9" x="3" y="3" rx="1"/>
          <rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="9" x="14" y="12" rx="1"/>
          <rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
      )
    },
    { 
      id: 'code', 
      label: '코드 프리뷰', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6"/>
          <polyline points="8,6 2,12 8,18"/>
        </svg>
      )
    }
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

        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
                data-tab={tab.id}
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
