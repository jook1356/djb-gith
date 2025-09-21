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
      icon: '⚛️',
      color: '#61dafb',
      details: 'Facebook에서 개발한 오픈소스 JavaScript 라이브러리로, 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI를 구축할 수 있습니다.'
    },
    {
      id: 2,
      title: 'TypeScript',
      description: 'JavaScript에 타입을 추가한 프로그래밍 언어',
      icon: '📘',
      color: '#3178c6',
      details: 'Microsoft에서 개발한 오픈소스 프로그래밍 언어로, JavaScript의 상위 집합이며 정적 타입 검사 기능을 제공합니다.'
    },
    {
      id: 3,
      title: 'Next.js',
      description: 'React 기반의 풀스택 웹 프레임워크',
      icon: '▲',
      color: '#000000',
      details: 'Vercel에서 개발한 React 프레임워크로, SSR, SSG, API Routes 등의 기능을 제공하여 현대적인 웹 애플리케이션을 구축할 수 있습니다.'
    },
    {
      id: 4,
      title: 'Sass',
      description: 'CSS 전처리기로 더 강력한 스타일링 도구',
      icon: '🎨',
      color: '#cc6699',
      details: 'CSS의 확장 언어로, 변수, 중첩, 믹스인, 함수 등의 기능을 제공하여 더 효율적이고 유지보수 가능한 스타일시트를 작성할 수 있습니다.'
    },
    {
      id: 5,
      title: 'Node.js',
      description: 'JavaScript 런타임 환경',
      icon: '🟢',
      color: '#339933',
      details: 'Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임으로, 서버 사이드 개발을 가능하게 하며 NPM 생태계를 통해 다양한 패키지를 활용할 수 있습니다.'
    },
    {
      id: 6,
      title: 'Git',
      description: '분산 버전 관리 시스템',
      icon: '📚',
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
          💡 카드를 클릭하면 3D 플립 효과와 함께 상세 정보를 볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}
