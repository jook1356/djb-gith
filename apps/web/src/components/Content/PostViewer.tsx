"use client";

import React, { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Link from "next/link";
import Frame from "@/components/Frame/Frame";
import styles from "./PostViewer.module.scss";

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

interface PostViewerProps {
  boardName: string;
  postId: string;
}

export default function PostViewer({ boardName, postId }: PostViewerProps) {
  const [post, setPost] = useState<{ meta: PostMeta; content: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [boardName, postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);

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

      setPost({ meta, content });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (markdown: string) => {
    const html = marked(markdown);
    return DOMPurify.sanitize(html as string);
  };

  if (loading) {
    return (
      <Frame>
        <div className={styles.loading}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonMeta}></div>
            <div className={styles.skeletonContent}></div>
          </div>
        </div>
      </Frame>
    );
  }

  if (error || !post) {
    return (
      <Frame>
        <div className={styles.error}>
          <h1>게시글을 찾을 수 없습니다</h1>
          <p>
            {error || "요청하신 게시글이 존재하지 않거나 공개되지 않았습니다."}
          </p>
          <div className={styles.errorActions}>
            <Link
              href={`/contents?board=${boardName}`}
              className={styles.backLink}
            >
              게시판으로 돌아가기
            </Link>
            <Link href="/contents" className={styles.allBoardsLink}>
              콘텐츠 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </Frame>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <Frame>
      <nav className={styles.breadcrumb}>
        <Link href="/contents" className={styles.breadcrumbLink}>
          콘텐츠
        </Link>
        <span className={styles.separator}>{">"}</span>
        <Link
          href={`/contents?board=${boardName}`}
          className={styles.breadcrumbLink}
        >
          {boardName}
        </Link>
        <span className={styles.separator}>{">"}</span>
        <span className={styles.current}>게시글</span>
      </nav>

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

            {post.meta.readingTime && (
              <span className={styles.readTime}>
                {post.meta.readingTime}분 읽기
              </span>
            )}
          </div>

          {post.meta.tags && post.meta.tags.length > 0 && (
            <div className={styles.tags}>
              {post.meta.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
        />
      </article>

      <div className={styles.navigation}>
        <Link href={`/contents?board=${boardName}`} className={styles.backLink}>
          ← {boardName} 게시판으로 돌아가기
        </Link>
      </div>
    </Frame>
  );
}
