import Link from "next/link";
import type { PostMeta } from "@/types/contents";
import styles from "./PostCard.module.scss";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className={styles.card}>
      <Link href={`/boards/${post.board}/${post.id}`} className={styles.link}>
        <div className={styles.content}>
          {post.featured && <span className={styles.featured}>추천</span>}

          <h2 className={styles.title}>{post.title}</h2>
          <p className={styles.description}>{post.description}</p>

          <div className={styles.meta}>
            <span className={styles.author}>{post.author}</span>
            <span className={styles.date}>{formatDate(post.createdAt)}</span>
            {post.readTime && (
              <span className={styles.readTime}>{post.readTime}분 읽기</span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
