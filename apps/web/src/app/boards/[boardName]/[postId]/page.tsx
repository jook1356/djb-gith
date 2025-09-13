import {
  getAllBoards,
  getBoardPosts,
  getPost,
  getBoardInfo,
} from "@/lib/contents";
import PostContent from "@/components/Post/PostContent";
import styles from "./page.module.scss";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    boardName: string;
    postId: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { boardName, postId } = await params;

  try {
    const post = await getPost(boardName, postId);

    if (!post || !post.meta.published) {
      throw new Error("Post not found or not published");
    }

    const boardInfo = getBoardInfo(boardName);

    return (
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/boards" className={styles.breadcrumbLink}>
            게시판
          </Link>
          <span className={styles.separator}>{">"}</span>
          <Link href={`/boards/${boardName}`} className={styles.breadcrumbLink}>
            {boardInfo.config.boardInfo.displayName}
          </Link>
          <span className={styles.separator}>{">"}</span>
          <span className={styles.current}>게시글</span>
        </nav>

        <PostContent post={post} />

        <div className={styles.navigation}>
          <Link href={`/boards/${boardName}`} className={styles.backLink}>
            ← {boardInfo.config.boardInfo.displayName}로 돌아가기
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>게시글을 찾을 수 없습니다</h1>
          <p>요청하신 게시글이 존재하지 않거나 공개되지 않았습니다.</p>
          <div className={styles.errorActions}>
            <Link href={`/boards/${boardName}`} className={styles.backLink}>
              게시판으로 돌아가기
            </Link>
            <Link href="/boards" className={styles.allBoardsLink}>
              모든 게시판 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

// 정적 경로 생성
export async function generateStaticParams() {
  const boardNames = getAllBoards();
  const params: { boardName: string; postId: string }[] = [];

  for (const boardName of boardNames) {
    try {
      const posts = getBoardPosts(boardName);
      const publishedPosts = posts.filter((post) => post.published);

      for (const post of publishedPosts) {
        params.push({
          boardName,
          postId: post.id,
        });
      }
    } catch (error) {
      // 게시판이 존재하지 않는 경우 스킵
      continue;
    }
  }

  return params;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: PostPageProps) {
  const { boardName, postId } = await params;

  try {
    const post = await getPost(boardName, postId);

    if (!post) {
      throw new Error("Post not found");
    }

    return {
      title: `${post.meta.title} | My Blog`,
      description: post.meta.description,
      keywords: post.meta.tags?.join(", "),
      authors: [{ name: post.meta.author }],
      openGraph: {
        title: post.meta.title,
        description: post.meta.description,
        type: "article",
        publishedTime: post.meta.createdAt,
        modifiedTime: post.meta.updatedAt,
        authors: [post.meta.author],
        tags: post.meta.tags,
      },
    };
  } catch {
    return {
      title: "게시글을 찾을 수 없습니다 | My Blog",
      description: "요청하신 게시글이 존재하지 않습니다.",
    };
  }
}
