'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import { generateRandomLayout, getItemIcon } from '@/lib/randomLayout';
import { useBoardPostsInfinite } from '@/hooks/useBoardPosts';
import styles from './BoardViewer.module.scss';

interface BoardViewerMobileProps {
  boardName: string;
}

export default function BoardViewerMobile({ boardName }: BoardViewerMobileProps) {
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useBoardPostsInfinite(boardName, 10);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  // 무한 스크롤 콜백
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Intersection Observer 설정
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const errorMessage = getErrorMessage(error);
  const allPosts = data?.pages.flatMap(page => page.posts) || [];

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
        <p>총 {data?.pages[0]?.totalCount || 0}개의 게시글</p>
      </div>

      {allPosts.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 게시글이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일용 리스트 레이아웃 */}
          <div className={styles.mobileList}>
            {allPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/contents?board=${boardName}&post=${encodeURIComponent(post.id)}`}
                className={styles.mobileCard}
                style={{
                  '--post-color': post.color || '#3b82f6',
                  '--animation-delay': `${index * 0.05}s`,
                } as React.CSSProperties}
              >
                {/* 카드 글로우 효과 */}
                <div 
                  className={styles.cardGlow} 
                  style={{ backgroundColor: post.color || '#3b82f6' }}
                ></div>
                
                {/* 카드 내용 */}
                <div className={styles.cardContent}>
                  {/* 헤더 */}
                  <div className={styles.cardHeader}>
                    <div 
                      className={styles.cardIcon} 
                      style={{ backgroundColor: post.color || '#3b82f6' }}
                    >
                      <svg viewBox="0 0 24 24" className={styles.iconSvg}>
                        {getItemIcon(index, allPosts.length)}
                      </svg>
                    </div>
                    
                    <div className={styles.readingBadge}>{post.readingTime}분</div>
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
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 액션 */}
                  <div className={styles.cardAction}>
                    <svg viewBox="0 0 16 16" className={styles.actionArrow}>
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 무한 스크롤 로딩 트리거 */}
          <div ref={loadMoreRef} className={styles.loadMore}>
            {isFetchingNextPage && (
              <div className={styles.loadingMore}>
                <div className={styles.spinner}></div>
                <span>더 많은 게시글을 불러오는 중...</span>
              </div>
            )}
            {!hasNextPage && allPosts.length > 0 && (
              <div className={styles.endMessage}>
                모든 게시글을 불러왔습니다.
              </div>
            )}
          </div>
        </>
      )}
    </Frame>
  );
}
