'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Frame from '@/components/Frame/Frame';
import styles from './ContentHome.module.scss';

interface BoardInfo {
  name: string;
  displayName: string;
  description: string;
  color: string;
  postCount: number;
}

export default function ContentHome() {
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);

      // GitHub API로 게시판 폴더 목록 가져오기
      const apiResponse = await fetch(
        'https://api.github.com/repos/jook1356/contents/contents/boards',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
      );

      if (!apiResponse.ok) {
        throw new Error('게시판 목록을 가져올 수 없습니다.');
      }

      const items = await apiResponse.json();
      
      // 폴더만 필터링
      const boardFolders = items.filter((item: any) => 
        item.type === 'dir' && !item.name.startsWith('_')
      );

      // 각 게시판의 설정 정보 가져오기
      const boardsPromises = boardFolders.map(async (folder: any) => {
        try {
          // 게시판 설정 가져오기
          const configResponse = await fetch(
            `https://jook1356.github.io/contents/boards/${folder.name}/_config.json`
          );
          
          // 게시글 개수 가져오기 (GitHub API)
          const postsResponse = await fetch(
            `https://api.github.com/repos/jook1356/contents/contents/boards/${folder.name}`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              }
            }
          );

          let config = null;
          let postCount = 0;

          if (configResponse.ok) {
            config = await configResponse.json();
          }

          if (postsResponse.ok) {
            const posts = await postsResponse.json();
            postCount = posts.filter((item: any) => 
              item.type === 'dir' && !item.name.startsWith('_')
            ).length;
          }

          return {
            name: folder.name,
            displayName: config?.boardInfo?.displayName || folder.name,
            description: config?.boardInfo?.description || '게시판 설명이 없습니다.',
            color: config?.boardInfo?.color || '#3498db',
            postCount
          };
        } catch {
          return {
            name: folder.name,
            displayName: folder.name,
            description: '게시판 설정을 불러올 수 없습니다.',
            color: '#95a5a6',
            postCount: 0
          };
        }
      });

      const boardsResults = await Promise.all(boardsPromises);
      setBoards(boardsResults);
      
    } catch (err) {
      console.error('게시판 목록 로드 실패:', err);
      // 기본 게시판 목록으로 폴백
      setBoards([
        {
          name: 'frontend',
          displayName: '프론트엔드',
          description: 'React, Vue, JavaScript 등 프론트엔드 기술',
          color: '#3498db',
          postCount: 0
        },
        {
          name: 'backend',
          displayName: '백엔드',
          description: 'Node.js, Python, 서버 개발 관련',
          color: '#27ae60',
          postCount: 0
        },
        {
          name: 'general',
          displayName: '일반',
          description: '개발 일반, 커리어, 기타 주제',
          color: '#9b59b6',
          postCount: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Frame>
        <div className={styles.header}>
          <h1>콘텐츠 뷰어</h1>
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

  return (
    <Frame>
      <div className={styles.header}>
        <h1>콘텐츠 뷰어</h1>
        <p>마크다운으로 작성된 게시글들을 확인할 수 있습니다.</p>
      </div>

      <div className={styles.boardGrid}>
        {boards.map((board) => (
          <Link
            key={board.name}
            href={`/contents?board=${board.name}`}
            className={styles.boardCard}
            style={{ '--board-color': board.color } as React.CSSProperties}
          >
            <h2 className={styles.boardName}>{board.displayName}</h2>
            <p className={styles.boardDescription}>{board.description}</p>
            <div className={styles.boardFooter}>
              <span className={styles.postCount}>{board.postCount}개 게시글</span>
              <span className={styles.viewMore}>게시글 보기 →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.info}>
        <h2>사용법</h2>
        <ul>
          <li>게시판을 선택하여 해당 분야의 게시글을 확인할 수 있습니다.</li>
          <li>URL에 직접 파라미터를 입력하여 특정 게시글에 접근할 수 있습니다.</li>
          <li>예시: <code>/contents?board=frontend&post=게시글ID</code></li>
        </ul>
      </div>
    </Frame>
  );
}
