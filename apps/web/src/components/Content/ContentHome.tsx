'use client';

import React from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import { generateRandomLayout, getItemIcon } from '@/lib/randomLayout';
import { useBoards } from '@/hooks/useBoards';
import styles from './ContentHome.module.scss';

export default function ContentHome() {
  const { data: boards = [], isLoading: loading, error } = useBoards();

  // 에러 처리를 위한 헬퍼 함수
  const getErrorInfo = (error: any) => {
    if (!error) return null;
    
    const errorMessage = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    
    if (errorMessage === 'RATE_LIMIT') {
      return {
        type: 'RATE_LIMIT',
        message: 'GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
      };
    } else if (errorMessage === 'EMPTY_BOARDS') {
      return {
        type: 'EMPTY_BOARDS',
        message: '아직 게시판이 없습니다.'
      };
    } else if (errorMessage === 'NOT_FOUND') {
      return {
        type: 'NOT_FOUND',
        message: '게시판 저장소를 찾을 수 없습니다.'
      };
    } else {
      return {
        type: 'API_ERROR',
        message: '게시판을 불러오는 중 오류가 발생했습니다.'
      };
    }
  };

  const errorInfo = getErrorInfo(error);
  if (loading) {
    return (
      <Frame>
        <div className={styles.loadingHeader}>
          <p>게시판 목록을 불러오는 중...</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.skeleton}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (errorInfo) {
    return (
      <Frame>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            {errorInfo.type === 'RATE_LIMIT' && (
              <>
                <div className={styles.errorIcon}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className={styles.errorTitle}>잠시만 기다려주세요</h1>
                <p className={styles.errorMessage}>{errorInfo.message}</p>
                <div className={styles.errorDetails}>
                  <p>GitHub API는 시간당 요청 횟수를 제한합니다.</p>
                  <p>약 1시간 후에 다시 시도하시거나, 나중에 다시 방문해주세요.</p>
                </div>
                <div className={styles.errorActions}>
                  <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                  >
                    다시 시도
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'} 
                    className={styles.dismissButton}
                  >
                    홈으로 가기
                  </button>
                </div>
              </>
            )}
            
            {errorInfo.type === 'NOT_FOUND' && (
              <>
                <div className={styles.errorIcon}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className={styles.errorTitle}>저장소를 찾을 수 없습니다</h1>
                <p className={styles.errorMessage}>{errorInfo.message}</p>
                <div className={styles.errorActions}>
                  <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                  >
                    다시 시도
                  </button>
                </div>
              </>
            )}
            
            {errorInfo.type === 'EMPTY_BOARDS' && (
              <>
                <div className={styles.errorIcon}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className={styles.errorTitle}>게시판이 없습니다</h1>
                <p className={styles.errorMessage}>{errorInfo.message}</p>
                <div className={styles.errorDetails}>
                  <p>아직 작성된 게시글이나 게시판이 없습니다.</p>
                  <p>곧 다양한 콘텐츠로 채워질 예정이니 기대해 주세요!</p>
                </div>
                <div className={styles.errorActions}>
                  <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                  >
                    새로고침
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'} 
                    className={styles.dismissButton}
                  >
                    홈으로 가기
                  </button>
                </div>
              </>
            )}
            
            {errorInfo.type === 'API_ERROR' && (
              <>
                <div className={styles.errorIcon}>
                  <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                    <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/>
                  </svg>
                </div>
                <h1 className={styles.errorTitle}>오류가 발생했습니다</h1>
                <p className={styles.errorMessage}>{errorInfo.message}</p>
                <div className={styles.errorActions}>
                  <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                  >
                    다시 시도
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Frame>
    );
  }

  // 랜덤 레이아웃 생성
  const randomLayout = generateRandomLayout(boards.length, 'board');
  
  // 디버깅 정보 출력
  console.log(`Boards: ${boards.length}, Layout cells: ${randomLayout.cells.length}`);

  return (
    <Frame>

      {/* 진정한 랜덤 그리드 레이아웃 */}
      <div 
        className={styles.randomGrid}
        style={{ 
          gridTemplateRows: `repeat(${randomLayout.gridRows}, 1fr)`,
          gridTemplateColumns: `repeat(${randomLayout.gridCols}, 1fr)`,
          '--board-count': boards.length,
          '--grid-rows': randomLayout.gridRows,
          '--grid-cols': randomLayout.gridCols
        } as React.CSSProperties}
      >
        {randomLayout.cells.map((cell) => {
          const boardIndex = parseInt(cell.id.replace('board', ''));
          const board = boards[boardIndex];
          if (!board) return null;

          return (
            <Link
              key={board.name}
              href={`/contents?board=${board.name}`}
              className={`${styles.randomCard} ${styles[`size-${cell.size}`]}`}
              style={{
                gridRow: `${cell.row} / ${cell.row + cell.rowSpan}`,
                gridColumn: `${cell.col} / ${cell.col + cell.colSpan}`,
                borderRadius: cell.borderRadius,
                transform: cell.transform || 'none',
                zIndex: cell.zIndex || 1,
                '--board-color': board.color,
                '--animation-delay': `${boardIndex * 0.1}s`,
                '--rotation-seed': boardIndex * 17 // 추가적인 랜덤 시드
              } as React.CSSProperties}
            >
              {/* 카드 글로우 효과 */}
              <div 
                className={styles.cardGlow} 
                style={{ backgroundColor: board.color }}
              ></div>
              
              {/* 배경 패턴 (히어로 카드용) */}
              {cell.size === 'hero' && (
                <div className={styles.cardBackground}>
                  <svg viewBox="0 0 400 300" className={styles.backgroundSvg}>
                    <defs>
                      <linearGradient id={`gradient-${boardIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={board.color} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={board.color} stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <circle cx="350" cy="50" r="60" fill={`url(#gradient-${boardIndex})`} />
                    <circle cx="50" cy="250" r="40" fill={`url(#gradient-${boardIndex})`} />
                    <rect x="200" y="150" width="80" height="80" rx="15" fill={`url(#gradient-${boardIndex})`} />
                  </svg>
                </div>
              )}

              {/* 카드 내용 */}
              <div className={styles.cardContent}>
                {/* 헤더 */}
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.cardIcon} 
                    style={{ backgroundColor: board.color }}
                  >
                    <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                      {getItemIcon(boardIndex, boards.length)}
                    </svg>
                  </div>
                  
                  {cell.size === 'hero' && (
                    <div className={styles.cardStats}>
                      <span className={styles.postCount}>{board.postCount}개</span>
                      <span className={styles.postLabel}>게시글</span>
                    </div>
                  )}
                  
                  {cell.size !== 'hero' && (
                    <div className={styles.postBadge}>{board.postCount}</div>
                  )}
                </div>

                {/* 제목과 설명 */}
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{board.displayName}</h2>
                  <p className={styles.cardDescription}>{board.description}</p>
                </div>

                {/* 액션 */}
                <div className={styles.cardAction}>
                  {cell.size === 'hero' ? (
                    <>
                      <span>둘러보기</span>
                      <svg viewBox="0 0 20 20" className={styles.actionArrow}>
                        <path d="M10 3L17 10L10 17M17 10H3" strokeWidth="2" fill="none" />
                      </svg>
                    </>
                  ) : (
                    <svg viewBox="0 0 16 16" className={styles.actionArrow}>
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" />
                    </svg>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </Frame>
  );
}
