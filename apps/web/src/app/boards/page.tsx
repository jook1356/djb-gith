import { getAllBoards, getBoardInfo } from "@/lib/contents";
import BoardCard from "@/components/Board/BoardCard";
import styles from "./page.module.scss";

export default function BoardsPage() {
  const boardNames = getAllBoards();
  const boards = boardNames.map((name) => getBoardInfo(name));

  // 활성화된 게시판만 필터링
  const activeBoards = boards.filter((board) => board.config.boardInfo.enabled);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>게시판</h1>
        <p className={styles.description}>
          다양한 주제의 개발 관련 게시글들을 확인해보세요.
        </p>
      </div>

      {activeBoards.length === 0 ? (
        <div className={styles.empty}>
          <p>아직 게시판이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {activeBoards.map((board) => (
            <BoardCard key={board.name} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}

// 정적 생성을 위한 메타데이터
export const metadata = {
  title: "게시판 | My Blog",
  description: "개발 관련 다양한 주제의 게시판들",
};
