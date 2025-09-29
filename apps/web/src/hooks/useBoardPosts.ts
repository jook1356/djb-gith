import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

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

interface PaginatedPosts {
  posts: PostSummary[];
  totalCount: number;
  hasNextPage: boolean;
  nextPage?: number;
}

// 게시판의 게시글 목록을 가져오는 함수
const fetchBoardPosts = async (boardName: string): Promise<PostSummary[]> => {
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

  return sortedPosts;
};

// 페이지네이션을 위한 게시글 가져오기 함수
const fetchBoardPostsPaginated = async (
  boardName: string, 
  page: number = 1, 
  pageSize: number = 10
): Promise<PaginatedPosts> => {
  const allPosts = await fetchBoardPosts(boardName);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const posts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    totalCount: allPosts.length,
    hasNextPage: endIndex < allPosts.length,
    nextPage: endIndex < allPosts.length ? page + 1 : undefined
  };
};

// 무한 스크롤을 위한 게시글 가져오기 함수
const fetchBoardPostsInfinite = async ({ 
  pageParam = 1, 
  queryKey 
}: { 
  pageParam: number; 
  queryKey: (string | number)[];
}): Promise<PaginatedPosts> => {
  const [, boardName, pageSize] = queryKey as [string, string, number];
  return fetchBoardPostsPaginated(boardName, pageParam, pageSize);
};

// 기존 훅 (호환성 유지)
export const useBoardPosts = (boardName: string) => {
  return useQuery({
    queryKey: ['board-posts', boardName],
    queryFn: () => fetchBoardPosts(boardName),
    enabled: !!boardName,
    throwOnError: false,
  });
};

// 페이지네이션을 위한 훅
export const useBoardPostsPaginated = (boardName: string, page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['board-posts-paginated', boardName, page, pageSize],
    queryFn: () => fetchBoardPostsPaginated(boardName, page, pageSize),
    enabled: !!boardName,
    throwOnError: false,
  });
};

// 무한 스크롤을 위한 훅
export const useBoardPostsInfinite = (boardName: string, pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['board-posts-infinite', boardName, pageSize],
    queryFn: fetchBoardPostsInfinite,
    enabled: !!boardName,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    throwOnError: false,
  });
};
