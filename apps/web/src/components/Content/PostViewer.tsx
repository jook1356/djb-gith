"use client";

import React from "react";
import Link from "next/link";
import Frame from "@/components/Frame/Frame";
import { usePost } from "@/hooks/usePost";
import Tiptap from "@/components/Tiptap/Tiptap";
import styles from "./PostViewer.module.scss";

interface PostViewerProps {
  boardName: string;
  postId: string;
}

export default function PostViewer({ boardName, postId }: PostViewerProps) {
  const { data: post, isLoading: loading, error } = usePost(boardName, postId);

  // 에러 메시지 처리
  const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";


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

  if (error || (!loading && !post)) {
    return (
      <Frame>
        <div className={styles.error}>
          <h1>게시글을 찾을 수 없습니다</h1>
          <p>
            {errorMessage || "요청하신 게시글이 존재하지 않거나 공개되지 않았습니다."}
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

  // 로딩이 완료되었지만 post가 없는 경우 처리
  if (!loading && !post) {
    return (
      <Frame>
        <div className={styles.error}>
          <h1>게시글을 찾을 수 없습니다</h1>
          <p>요청하신 게시글이 존재하지 않거나 공개되지 않았습니다.</p>
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
          <h1 className={styles.title}>{post?.meta.title}</h1>
          <p className={styles.description}>{post?.meta.description}</p>

          <div className={styles.meta}>
            <div className={styles.author}>
              <span>작성자: {post?.meta.author}</span>
            </div>

            <div className={styles.dates}>
              <time className={styles.date}>
                작성일: {post?.meta.createdAt && formatDate(post.meta.createdAt)}
              </time>
              {post?.meta.updatedAt !== post?.meta.createdAt && (
                <time className={styles.date}>
                  수정일: {post?.meta.updatedAt && formatDate(post.meta.updatedAt)}
                </time>
              )}
            </div>

            {post?.meta.readingTime && (
              <span className={styles.readTime}>
                {post.meta.readingTime}분 읽기
              </span>
            )}
          </div>

          {post?.meta.tags && post.meta.tags.length > 0 && (
            <div className={styles.tags}>
              {post.meta.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className={styles.content}>
          <Tiptap
            markdownContent={post?.content || ''}
            readonly={true}
            editable={false}
          />
        </div>
      </article>

      <div className={styles.navigation}>
        <Link href={`/contents?board=${boardName}`} className={styles.backLink}>
          ← {boardName} 게시판으로 돌아가기
        </Link>
      </div>
    </Frame>
  );
}
