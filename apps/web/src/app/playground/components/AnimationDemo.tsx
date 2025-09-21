"use client";

import { useState } from 'react';
import styles from './AnimationDemo.module.scss';

export function AnimationDemo() {
  const [activeAnimation, setActiveAnimation] = useState('bounce');
  const [isPlaying, setIsPlaying] = useState(false);

  const animations = [
    { id: 'bounce', name: 'Bounce', description: '튕기는 효과' },
    { id: 'fadeIn', name: 'Fade In', description: '서서히 나타나는 효과' },
    { id: 'slideIn', name: 'Slide In', description: '슬라이드 효과' },
    { id: 'rotate', name: 'Rotate', description: '회전 효과' },
    { id: 'scale', name: 'Scale', description: '크기 변화 효과' },
    { id: 'shake', name: 'Shake', description: '흔들리는 효과' },
    { id: 'pulse', name: 'Pulse', description: '맥박 효과' },
    { id: 'flip', name: 'Flip', description: '뒤집기 효과' }
  ];

  const playAnimation = (animationId: string) => {
    setActiveAnimation(animationId);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <div className={styles.animationDemo}>
      <div className={styles.header}>
        <h2 className={styles.title}>애니메이션 데모</h2>
        <p className={styles.description}>
          다양한 CSS 애니메이션 효과를 실시간으로 확인해보세요.
        </p>
      </div>

      <div className={styles.demoArea}>
        <div className={styles.animationContainer}>
          <div 
            className={`${styles.animationBox} ${isPlaying ? styles[activeAnimation] : ''}`}
          >
            <div className={styles.boxContent}>
              <div className={styles.boxIcon}>✨</div>
              <div className={styles.boxText}>Animation</div>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <h3 className={styles.controlsTitle}>애니메이션 선택</h3>
          <div className={styles.animationGrid}>
            {animations.map((animation) => (
              <button
                key={animation.id}
                className={`${styles.animationButton} ${activeAnimation === animation.id ? styles.active : ''}`}
                onClick={() => playAnimation(animation.id)}
                disabled={isPlaying}
              >
                <div className={styles.buttonIcon}>
                  {animation.id === 'bounce' && '⬆️'}
                  {animation.id === 'fadeIn' && '👁️'}
                  {animation.id === 'slideIn' && '➡️'}
                  {animation.id === 'rotate' && '🔄'}
                  {animation.id === 'scale' && '🔍'}
                  {animation.id === 'shake' && '📳'}
                  {animation.id === 'pulse' && '💓'}
                  {animation.id === 'flip' && '🔄'}
                </div>
                <div className={styles.buttonText}>
                  <div className={styles.buttonName}>{animation.name}</div>
                  <div className={styles.buttonDescription}>{animation.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.codeSection}>
        <h3 className={styles.codeTitle}>CSS 코드</h3>
        <div className={styles.codeBlock}>
          <pre className={styles.code}>
{`@keyframes ${activeAnimation} {
  ${activeAnimation === 'bounce' ? `0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }` : ''}
  ${activeAnimation === 'fadeIn' ? `0% { opacity: 0; }
  100% { opacity: 1; }` : ''}
  ${activeAnimation === 'slideIn' ? `0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }` : ''}
  ${activeAnimation === 'rotate' ? `0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }` : ''}
  ${activeAnimation === 'scale' ? `0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }` : ''}
  ${activeAnimation === 'shake' ? `0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }` : ''}
  ${activeAnimation === 'pulse' ? `0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }` : ''}
  ${activeAnimation === 'flip' ? `0% { transform: rotateY(0); }
  100% { transform: rotateY(180deg); }` : ''}
}

.animation {
  animation: ${activeAnimation} 2s ease-in-out;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
