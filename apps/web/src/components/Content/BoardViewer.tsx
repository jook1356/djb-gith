'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import { generateRandomLayout, getItemIcon } from '@/lib/randomLayout';
import styles from './BoardViewer.module.scss';

interface PostSummary {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  readingTime: number;
  color?: string;
}

interface BoardViewerProps {
  boardName: string;
}

export default function BoardViewer({ boardName }: BoardViewerProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoardPosts();
  }, [boardName]);

  const loadBoardPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // GitHub REST API를 통해 게시글 폴더 목록 가져오기
      const apiResponse = await fetch(
        `https://api.github.com/repos/jook1356/contents/contents/boards/${boardName}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        
        // documentation_url로 rate limiting 정확히 판단
        if (apiResponse.status === 403 && 
            errorData.documentation_url?.includes('rate-limiting')) {
          throw new Error('RATE_LIMIT');
        } else if (apiResponse.status === 404) {
          throw new Error('NOT_FOUND');
        } else {
          throw new Error('API_ERROR');
        }
      }

      const items = await apiResponse.json();
      
      // 폴더만 필터링 (게시글 폴더들)
      const postFolders = items.filter((item: any) => 
        item.type === 'dir' && !item.name.startsWith('_')
      );

      // 빈 게시판 처리
      if (postFolders.length === 0) {
        throw new Error('EMPTY_POSTS');
      }

      // 각 게시글의 메타데이터 병렬로 가져오기
      const postsPromises = postFolders.map(async (folder: any) => {
        try {
          const metaResponse = await fetch(
            `https://jook1356.github.io/contents/boards/${boardName}/${folder.name}/meta.json`
          );
          
          if (metaResponse.ok) {
            const meta = await metaResponse.json();
            // 토스 스타일 색상 팔레트
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#6366f1'];
            const colorIndex = postFolders.indexOf(folder) % colors.length;
            
            return {
              id: folder.name,
              title: meta.title,
              description: meta.description,
              author: meta.author,
              createdAt: meta.createdAt,
              tags: meta.tags || [],
              readingTime: meta.readingTime || 5,
              color: colors[colorIndex]
            };
          }
          return null;
        } catch {
          return null;
        }
      });

      const postsResults = await Promise.all(postsPromises);
      const validPosts = postsResults.filter(post => post !== null) as PostSummary[];
      
      // 생성일 기준으로 내림차순 정렬
      const sortedPosts = validPosts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(sortedPosts);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      
      if (errorMessage === 'RATE_LIMIT') {
        setError('RATE_LIMIT:GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (errorMessage === 'EMPTY_POSTS') {
        setError(`EMPTY_POSTS:'${boardName}' 게시판에 아직 게시글이 없습니다.`);
      } else if (errorMessage === 'NOT_FOUND') {
        setError(`NOT_FOUND:'${boardName}' 게시판을 찾을 수 없습니다.`);
      } else {
        setError('API_ERROR:게시글을 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
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

  if (error) {
    const [errorType, errorMessage] = error.split(':');
    
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
          
          <p className={styles.errorMessage}>{errorMessage}</p>
          
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
                onClick={() => loadBoardPosts()} 
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
        <p>총 {posts.length}개의 게시글</p>
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
        </>
      )}
    </Frame>
  );
}
