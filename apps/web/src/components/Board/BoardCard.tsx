import Link from "next/link";
import type { BoardInfo } from "@/types/contents";
import styles from "./BoardCard.module.scss";

interface BoardCardProps {
  board: BoardInfo;
}

export default function BoardCard({ board }: BoardCardProps) {
  const { name, config, posts } = board;
  const postCount = posts.length;
  const recentPosts = posts.slice(0, 3);

  return (
    <div className={styles.card}>
      <Link href={`/boards/${name}`} className={styles.link}>
        <div className={styles.header}>
          <span className={styles.icon}>{config.boardInfo.icon}</span>
          <h3 className={styles.title}>{config.boardInfo.displayName}</h3>
        </div>

        <p className={styles.description}>{config.boardInfo.description}</p>

        <div className={styles.stats}>
          <span className={styles.count}>{postCount}개 게시글</span>
        </div>

        {recentPosts.length > 0 && (
          <div className={styles.recentPosts}>
            <h4 className={styles.recentTitle}>최근 게시글</h4>
            <ul className={styles.postList}>
              {recentPosts.map((post) => (
                <li key={post.id} className={styles.postItem}>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Link>
    </div>
  );
}
