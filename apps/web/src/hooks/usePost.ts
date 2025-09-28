import { useQuery } from '@tanstack/react-query';

interface PostMeta {
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  published: boolean;
  readingTime: number;
}

interface Post {
  meta: PostMeta;
  content: string;
}

// 게시글을 가져오는 함수
const fetchPost = async (boardName: string, postId: string): Promise<Post> => {
  // contents 서브모듈에서 메타데이터와 마크다운 병렬 페칭
  const [metaResponse, contentResponse] = await Promise.all([
    fetch(
      `https://jook1356.github.io/contents/boards/${boardName}/${postId}/meta.json`
    ),
    fetch(
      `https://jook1356.github.io/contents/boards/${boardName}/${postId}/index.md`
    ),
  ]);

  if (!metaResponse.ok || !contentResponse.ok) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }

  const [meta, content] = await Promise.all([
    metaResponse.json(),
    contentResponse.text(),
  ]);

  if (!meta.published) {
    throw new Error("공개되지 않은 게시글입니다.");
  }

  return { meta, content };
};

// 게시글을 가져오는 커스텀 훅
export const usePost = (boardName: string, postId: string) => {
  return useQuery({
    queryKey: ['post', boardName, postId],
    queryFn: () => fetchPost(boardName, postId),
    // boardName과 postId가 모두 있을 때만 쿼리 실행
    enabled: !!boardName && !!postId,
    // 에러 처리를 위한 추가 옵션
    throwOnError: false,
  });
};
