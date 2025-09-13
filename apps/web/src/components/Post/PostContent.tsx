import type { Post } from "@/types/contents";
import styles from "./PostContent.module.scss";

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.meta.title}</h1>
        <p className={styles.description}>{post.meta.description}</p>

        <div className={styles.meta}>
          <div className={styles.author}>
            <span>작성자: {post.meta.author}</span>
          </div>

          <div className={styles.dates}>
            <time className={styles.date}>
              작성일: {formatDate(post.meta.createdAt)}
            </time>
            {post.meta.updatedAt !== post.meta.createdAt && (
              <time className={styles.date}>
                수정일: {formatDate(post.meta.updatedAt)}
              </time>
            )}
          </div>

          {post.meta.readTime && (
            <span className={styles.readTime}>{post.meta.readTime}분 읽기</span>
          )}
        </div>

        {post.meta.tags.length > 0 && (
          <div className={styles.tags}>
            {post.meta.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
