'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import styles from './BoardViewer.module.scss';

interface PostSummary {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  readingTime: number;
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
        throw new Error('게시판을 찾을 수 없습니다.');
      }

      const items = await apiResponse.json();
      
      // 폴더만 필터링 (게시글 폴더들)
      const postFolders = items.filter((item: any) => 
        item.type === 'dir' && !item.name.startsWith('_')
      );

      // 각 게시글의 메타데이터 병렬로 가져오기
      const postsPromises = postFolders.map(async (folder: any) => {
        try {
          const metaResponse = await fetch(
            `https://jook1356.github.io/contents/boards/${boardName}/${folder.name}/meta.json`
          );
          
          if (metaResponse.ok) {
            const meta = await metaResponse.json();
            return {
              id: folder.name,
              title: meta.title,
              description: meta.description,
              author: meta.author,
              createdAt: meta.createdAt,
              tags: meta.tags || [],
              readingTime: meta.readingTime || 5
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
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
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
    return (
      <Frame>
        <div className={styles.error}>
          <h1>게시판을 찾을 수 없습니다</h1>
          <p>{error}</p>
          <Link href="/contents" className={styles.backLink}>
            콘텐츠 홈으로 돌아가기
          </Link>
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
        <div className={styles.postList}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/contents?board=${boardName}&post=${encodeURIComponent(post.id)}`}
              className={styles.postCard}
            >
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDescription}>{post.description}</p>
              <div className={styles.postMeta}>
                <span className={styles.author}>{post.author}</span>
                <span className={styles.date}>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                </span>
                <span className={styles.readingTime}>{post.readingTime}분</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </Frame>
  );
}
