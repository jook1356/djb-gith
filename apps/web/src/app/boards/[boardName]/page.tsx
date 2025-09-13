import { getAllBoards, getBoardInfo } from "@/lib/contents";
import PostList from "@/components/Post/PostList";
import styles from "./page.module.scss";
import Link from "next/link";

interface BoardPageProps {
  params: Promise<{ boardName: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardName } = await params;

  // 더미 파라미터인 경우 404 페이지 반환
  if (boardName === "_dummy") {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>게시판을 찾을 수 없습니다</h1>
          <p>요청하신 게시판이 존재하지 않습니다.</p>
          <Link href="/boards" className={styles.backLink}>
            게시판 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  try {
    const boardInfo = getBoardInfo(boardName);
    const { config, posts } = boardInfo;

    // 공개된 게시글만 필터링
    const publishedPosts = posts.filter((post) => post.published);

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/boards" className={styles.breadcrumbLink}>
              게시판
            </Link>
            <span className={styles.separator}>{">"}</span>
            <span className={styles.current}>
              {config.boardInfo.displayName}
            </span>
          </nav>

          <div className={styles.boardHeader}>
            <span className={styles.icon}>{config.boardInfo.icon}</span>
            <div>
              <h1 className={styles.title}>{config.boardInfo.displayName}</h1>
              <p className={styles.description}>
                {config.boardInfo.description}
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              총 {publishedPosts.length}개의 게시글
            </span>
          </div>
        </div>

        <PostList
          posts={publishedPosts}
          emptyMessage={`${config.boardInfo.displayName} 게시판에 아직 게시글이 없습니다.`}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>게시판을 찾을 수 없습니다</h1>
          <p>요청하신 게시판이 존재하지 않습니다.</p>
          <Link href="/boards" className={styles.backLink}>
            게시판 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
}

// 정적 경로 생성
export async function generateStaticParams() {
  try {
    console.log("Generating static params for [boardName] page...");

    const boardNames = getAllBoards();
    console.log("Found board names:", boardNames);

    if (boardNames.length === 0) {
      console.log("No board names found, returning dummy params to prevent build failure");
      // Next.js의 output: export에서는 빈 배열을 반환하면 에러가 발생할 수 있음
      // 최소한의 더미 파라미터를 반환하여 빌드가 성공하도록 함
      return [
        {
          boardName: "_dummy",
        },
      ];
    }

    const params = boardNames.map((boardName) => ({
      boardName,
    }));

    console.log(`Generated ${params.length} static params for boards:`, params);
    return params;
  } catch (error) {
    console.error("Error in generateStaticParams for [boardName]:", error);
    // 에러가 발생하더라도 더미 파라미터를 반환하여 빌드가 실패하지 않도록 함
    return [{ boardName: "_dummy" }];
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: BoardPageProps) {
  const { boardName } = await params;

  try {
    const boardInfo = getBoardInfo(boardName);
    const { config } = boardInfo;

    return {
      title: `${config.boardInfo.displayName} | My Blog`,
      description: config.boardInfo.description,
    };
  } catch {
    return {
      title: "게시판을 찾을 수 없습니다 | My Blog",
      description: "요청하신 게시판이 존재하지 않습니다.",
    };
  }
}
