"use client";

import { useState } from 'react';
import styles from './InteractiveCards.module.scss';

export function InteractiveCards() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [likedCards, setLikedCards] = useState<Set<number>>(new Set());

  const cards = [
    {
      id: 1,
      title: 'React',
      description: '사용자 인터페이스를 만들기 위한 JavaScript 라이브러리',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: '#61dafb',
      details: 'Facebook에서 개발한 오픈소스 JavaScript 라이브러리로, 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI를 구축할 수 있습니다.'
    },
    {
      id: 2,
      title: 'TypeScript',
      description: 'JavaScript에 타입을 추가한 프로그래밍 언어',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      color: '#3178c6',
      details: 'Microsoft에서 개발한 오픈소스 프로그래밍 언어로, JavaScript의 상위 집합이며 정적 타입 검사 기능을 제공합니다.'
    },
    {
      id: 3,
      title: 'Next.js',
      description: 'React 기반의 풀스택 웹 프레임워크',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
      color: '#000000',
      details: 'Vercel에서 개발한 React 프레임워크로, SSR, SSG, API Routes 등의 기능을 제공하여 현대적인 웹 애플리케이션을 구축할 수 있습니다.'
    },
    {
      id: 4,
      title: 'Sass',
      description: 'CSS 전처리기로 더 강력한 스타일링 도구',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <circle cx="12" cy="2" r="10"/>
        </svg>
      ),
      color: '#cc6699',
      details: 'CSS의 확장 언어로, 변수, 중첩, 믹스인, 함수 등의 기능을 제공하여 더 효율적이고 유지보수 가능한 스타일시트를 작성할 수 있습니다.'
    },
    {
      id: 5,
      title: 'Node.js',
      description: 'JavaScript 런타임 환경',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      color: '#339933',
      details: 'Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임으로, 서버 사이드 개발을 가능하게 하며 NPM 생태계를 통해 다양한 패키지를 활용할 수 있습니다.'
    },
    {
      id: 6,
      title: 'Git',
      description: '분산 버전 관리 시스템',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      ),
      color: '#f05032',
      details: 'Linus Torvalds가 개발한 분산 버전 관리 시스템으로, 소스코드의 변경사항을 추적하고 여러 개발자가 협업할 수 있게 해줍니다.'
    }
  ];

  const toggleFlip = (cardId: number) => {
    const newFlippedCards = new Set(flippedCards);
    if (newFlippedCards.has(cardId)) {
      newFlippedCards.delete(cardId);
    } else {
      newFlippedCards.add(cardId);
    }
    setFlippedCards(newFlippedCards);
  };

  const toggleLike = (cardId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newLikedCards = new Set(likedCards);
    if (newLikedCards.has(cardId)) {
      newLikedCards.delete(cardId);
    } else {
      newLikedCards.add(cardId);
    }
    setLikedCards(newLikedCards);
  };

  return (
    <div className={styles.interactiveCards}>
      <div className={styles.header}>
        <h2 className={styles.title}>인터랙티브 카드</h2>
        <p className={styles.description}>
          카드를 클릭하면 뒤집히고, 하트를 클릭하면 좋아요를 표시할 수 있습니다.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{flippedCards.size}</span>
          <span className={styles.statLabel}>뒤집힌 카드</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{likedCards.size}</span>
          <span className={styles.statLabel}>좋아요한 카드</span>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.cardContainer} ${flippedCards.has(card.id) ? styles.flipped : ''}`}
            onClick={() => toggleFlip(card.id)}
          >
            <div className={styles.card}>
              {/* 앞면 */}
              <div className={styles.cardFront}>
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.cardIcon}
                    style={{ backgroundColor: card.color }}
                  >
                    {card.icon}
                  </div>
                  <button
                    className={`${styles.likeButton} ${likedCards.has(card.id) ? styles.liked : ''}`}
                    onClick={(e) => toggleLike(card.id, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.flipHint}>클릭하여 자세히 보기</span>
                </div>
              </div>

              {/* 뒷면 */}
              <div className={styles.cardBack}>
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.cardIcon}
                    style={{ backgroundColor: card.color }}
                  >
                    {card.icon}
                  </div>
                  <button
                    className={`${styles.likeButton} ${likedCards.has(card.id) ? styles.liked : ''}`}
                    onClick={(e) => toggleLike(card.id, e)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDetails}>{card.details}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.flipHint}>클릭하여 돌아가기</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.tip}>
          <svg className={styles.tipIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          카드를 클릭하면 3D 플립 효과와 함께 상세 정보를 볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}
