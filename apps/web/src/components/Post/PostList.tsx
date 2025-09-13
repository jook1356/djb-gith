import type { PostMeta } from "@/types/contents";
import PostCard from "./PostCard";
import styles from "./PostList.module.scss";

interface PostListProps {
  posts: PostMeta[];
  title?: string;
  emptyMessage?: string;
}

export default function PostList({
  posts,
  title = "게시글",
  emptyMessage = "아직 게시글이 없습니다.",
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
