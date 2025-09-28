import { useQuery } from '@tanstack/react-query';

interface BoardInfo {
  name: string;
  displayName: string;
  description: string;
  color: string;
  postCount: number;
}

// 게시판 목록을 가져오는 함수
const fetchBoards = async (): Promise<BoardInfo[]> => {
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
  
  // 폴더만 필터링
  const boardFolders = items.filter((item: any) => 
    item.type === 'dir' && !item.name.startsWith('_')
  );

  // 빈 게시판 목록 처리
  if (boardFolders.length === 0) {
    throw new Error('EMPTY_BOARDS');
  }

  // 각 게시판의 설정 정보 가져오기
  const boardsPromises = boardFolders.map(async (folder: any) => {
    try {
      // GitHub API를 통해 게시판 설정 가져오기
      const configResponse = await fetch(
        `https://api.github.com/repos/jook1356/contents/contents/boards/${folder.name}/_config.json`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
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
        const configData = await configResponse.json();
        // GitHub API는 base64로 인코딩된 content를 반환
        // UTF-8 문자를 올바르게 처리하기 위해 fetch를 통한 직접 디코딩
        const decodedContent = decodeURIComponent(
          atob(configData.content)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        config = JSON.parse(decodedContent);
      }

      if (postsResponse.ok) {
        const posts = await postsResponse.json();
        postCount = posts.filter((item: any) => 
          item.type === 'dir' && !item.name.startsWith('_')
        ).length;
      }

      // 토스 스타일 색상 팔레트
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#6366f1'];
      const colorIndex = boardFolders.indexOf(folder) % colors.length;
      
      return {
        name: folder.name,
        displayName: config?.boardInfo?.displayName || folder.name,
        description: config?.boardInfo?.description || '게시판 설명이 없습니다.',
        color: config?.boardInfo?.color || colors[colorIndex],
        postCount
      };
    } catch (error) {
      console.error(`Error loading board config for ${folder.name}:`, error);
      // 에러 시에도 토스 색상 사용
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#6366f1'];
      const colorIndex = boardFolders.indexOf(folder) % colors.length;
      
      return {
        name: folder.name,
        displayName: folder.name,
        description: '게시판 설정을 불러올 수 없습니다.',
        color: colors[colorIndex],
        postCount: 0
      };
    }
  });

  const boardsResults = await Promise.all(boardsPromises);
  return boardsResults;
};

// 게시판 목록을 가져오는 커스텀 훅
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
    // 에러 처리를 위한 추가 옵션
    throwOnError: false,
  });
};
