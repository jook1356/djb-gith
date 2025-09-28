'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import { generateRandomLayout, getItemIcon } from '@/lib/randomLayout';
import { useBoardPostsPaginated } from '@/hooks/useBoardPosts';
import styles from './BoardViewer.module.scss';

interface BoardViewerDesktopProps {
  boardName: string;
}

export default function BoardViewerDesktop({ boardName }: BoardViewerDesktopProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { data, isLoading: loading, error } = useBoardPostsPaginated(boardName, currentPage, pageSize);

  // 에러 처리를 위한 헬퍼 함수
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    
    const errorMessage = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    
    if (errorMessage === 'RATE_LIMIT') {
      return 'RATE_LIMIT:GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
    } else if (errorMessage === 'EMPTY_POSTS') {
      return `EMPTY_POSTS:'${boardName}' 게시판에 아직 게시글이 없습니다.`;
    } else if (errorMessage === 'NOT_FOUND') {
      return `NOT_FOUND:'${boardName}' 게시판을 찾을 수 없습니다.`;
    } else {
      return 'API_ERROR:게시글을 불러오는 중 오류가 발생했습니다.';
    }
  };

  const errorMessage = getErrorMessage(error);
  const posts = data?.posts || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 페이지네이션 버튼 생성
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 이전 페이지 버튼
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className={styles.paginationButton}
        >
          이전
        </button>
      );
    }

    // 첫 페이지
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={styles.paginationButton}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className={styles.paginationEllipsis}>
            ...
          </span>
        );
      }
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.paginationButton} ${
            i === currentPage ? styles.paginationButtonActive : ''
          }`}
        >
          {i}
        </button>
      );
    }

    // 마지막 페이지
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className={styles.paginationEllipsis}>
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={styles.paginationButton}
        >
          {totalPages}
        </button>
      );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className={styles.paginationButton}
        >
          다음
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <Frame>
        <div className={styles.loading}>
          <div className={styles.skeleton}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (errorMessage) {
    const [errorType, errorMsg] = errorMessage.split(':');
    
    return (
      <Frame>
        <div className={styles.error}>
          <div className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" className={styles.iconSvg}>
              {errorType === 'RATE_LIMIT' ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              ) : errorType === 'EMPTY_POSTS' ? (
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              )}
            </svg>
          </div>
          
          <h1 className={styles.errorTitle}>
            {errorType === 'RATE_LIMIT' ? '잠시만 기다려주세요' : 
             errorType === 'EMPTY_POSTS' ? '게시글이 없습니다' : 
             errorType === 'NOT_FOUND' ? '게시판을 찾을 수 없습니다' : 
             '오류가 발생했습니다'}
          </h1>
          
          <p className={styles.errorMessage}>{errorMsg}</p>
          
          {errorType === 'RATE_LIMIT' && (
            <div className={styles.errorDetails}>
              <p>GitHub API는 시간당 요청 횟수를 제한합니다.</p>
              <p>약 1시간 후에 다시 시도하시거나, 나중에 다시 방문해주세요.</p>
            </div>
          )}
          
          {errorType === 'EMPTY_POSTS' && (
            <div className={styles.errorDetails}>
              <p>이 게시판에는 아직 작성된 게시글이 없습니다.</p>
              <p>곧 다양한 콘텐츠로 채워질 예정이니 기대해 주세요!</p>
            </div>
          )}
          
          <div className={styles.errorActions}>
            {errorType !== 'NOT_FOUND' && (
              <button 
                onClick={() => window.location.reload()} 
                className={styles.retryButton}
              >
                {errorType === 'EMPTY_POSTS' ? '새로고침' : '다시 시도'}
              </button>
            )}
            <Link href="/contents" className={styles.backLink}>
              콘텐츠 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <nav className={styles.breadcrumb}>
        <Link href="/contents" className={styles.breadcrumbLink}>
          콘텐츠
        </Link>
        <span className={styles.separator}>{">"}</span>
        <span className={styles.current}>{boardName}</span>
      </nav>

      <div className={styles.boardHeader}>
        <h1>{boardName} 게시판</h1>
        <p>총 {totalCount}개의 게시글</p>
        {totalPages > 1 && (
          <p className={styles.pageInfo}>
            {currentPage} / {totalPages} 페이지
          </p>
        )}
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 게시글이 없습니다.</p>
        </div>
      ) : (
        <>
          {(() => {
            // 랜덤 레이아웃 생성
            const randomLayout = generateRandomLayout(posts.length, 'post');
            
            return (
              <div 
                className={styles.randomGrid}
                style={{ 
                  gridTemplateRows: `repeat(${randomLayout.gridRows}, 1fr)`,
                  gridTemplateColumns: `repeat(${randomLayout.gridCols}, 1fr)`,
                  '--post-count': posts.length,
                  '--grid-rows': randomLayout.gridRows,
                  '--grid-cols': randomLayout.gridCols
                } as React.CSSProperties}
              >
                {randomLayout.cells.map((cell) => {
                  const postIndex = parseInt(cell.id.replace('post', ''));
                  const post = posts[postIndex];
                  if (!post) return null;

                  return (
                    <Link
                      key={post.id}
                      href={`/contents?board=${boardName}&post=${encodeURIComponent(post.id)}`}
                      className={`${styles.randomCard} ${styles[`size-${cell.size}`]}`}
                      style={{
                        gridRow: `${cell.row} / ${cell.row + cell.rowSpan}`,
                        gridColumn: `${cell.col} / ${cell.col + cell.colSpan}`,
                        borderRadius: cell.borderRadius,
                        transform: cell.transform || 'none',
                        zIndex: cell.zIndex || 1,
                        '--post-color': post.color || '#3b82f6',
                        '--animation-delay': `${postIndex * 0.1}s`,
                        '--rotation-seed': postIndex * 17
                      } as React.CSSProperties}
                    >
                      {/* 카드 글로우 효과 */}
                      <div 
                        className={styles.cardGlow} 
                        style={{ backgroundColor: post.color || '#3b82f6' }}
                      ></div>
                      
                      {/* 배경 패턴 (히어로 카드용) */}
                      {cell.size === 'hero' && (
                        <div className={styles.cardBackground}>
                          <svg viewBox="0 0 400 300" className={styles.backgroundSvg}>
                            <defs>
                              <linearGradient id={`gradient-${postIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={post.color || '#3b82f6'} stopOpacity="0.6" />
                                <stop offset="100%" stopColor={post.color || '#3b82f6'} stopOpacity="0.2" />
                              </linearGradient>
                            </defs>
                            <circle cx="350" cy="50" r="60" fill={`url(#gradient-${postIndex})`} />
                            <circle cx="50" cy="250" r="40" fill={`url(#gradient-${postIndex})`} />
                            <rect x="200" y="150" width="80" height="80" rx="15" fill={`url(#gradient-${postIndex})`} />
                          </svg>
                        </div>
                      )}

                      {/* 카드 내용 */}
                      <div className={styles.cardContent}>
                        {/* 헤더 */}
                        <div className={styles.cardHeader}>
                          <div 
                            className={styles.cardIcon} 
                            style={{ backgroundColor: post.color || '#3b82f6' }}
                          >
                            <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                              {getItemIcon(postIndex, posts.length)}
                            </svg>
                          </div>
                          
                          {cell.size === 'hero' && (
                            <div className={styles.cardStats}>
                              <span className={styles.readingTime}>{post.readingTime}분</span>
                              <span className={styles.readingLabel}>읽기</span>
                            </div>
                          )}
                          
                          {cell.size !== 'hero' && (
                            <div className={styles.readingBadge}>{post.readingTime}분</div>
                          )}
                        </div>

                        {/* 제목과 설명 */}
                        <div className={styles.cardBody}>
                          <h2 className={styles.cardTitle}>{post.title}</h2>
                          <p className={styles.cardDescription}>{post.description}</p>
                          
                          {/* 메타 정보 */}
                          <div className={styles.cardMeta}>
                            <span className={styles.author}>{post.author}</span>
                            <span className={styles.date}>
                              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          
                          {/* 태그 */}
                          {post.tags && post.tags.length > 0 && (
                            <div className={styles.tags}>
                              {post.tags.slice(0, cell.size === 'hero' ? 4 : 2).map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 액션 */}
                        <div className={styles.cardAction}>
                          {cell.size === 'hero' ? (
                            <>
                              <span>읽어보기</span>
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
            );
          })()}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationContainer}>
                {generatePaginationButtons()}
              </div>
              <div className={styles.paginationInfo}>
                {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} / {totalCount}개 게시글
              </div>
            </div>
          )}
        </>
      )}
    </Frame>
  );
}
