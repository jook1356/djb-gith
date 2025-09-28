"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Frame from "@/components/Frame/Frame";
import { usePost } from "@/hooks/usePost";
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import styles from "./PostViewer.module.scss";

interface PostViewerProps {
  boardName: string;
  postId: string;
}

export default function PostViewer({ boardName, postId }: PostViewerProps) {
  const { data: post, isLoading: loading, error } = usePost(boardName, postId);
  const [mdxError, setMdxError] = useState(false);

  // 에러 메시지 처리
  const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  // MDXEditor 에러 핸들러
  const handleMdxError = () => {
    console.error("MDXEditor 렌더링 실패, fallback으로 전환");
    setMdxError(true);
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
          {post?.content ? (
            <>
              {/* 디버깅용: 원본 마크다운 내용 확인 */}
              <div style={{ display: 'none' }}>
                <pre>{post.content}</pre>
              </div>
              
              {!mdxError ? (
                <div>
                  <MDXEditor
                    key={`mdx-${boardName}-${postId}`}
                    markdown={post.content}
                    readOnly={true}
                    contentEditableClassName={styles.mdxContent}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      markdownShortcutPlugin(),
                      linkPlugin(),
                      imagePlugin(),
                      tablePlugin(),
                      codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
                      codeMirrorPlugin({ 
                        codeBlockLanguages: {
                          js: 'JavaScript',
                          javascript: 'JavaScript',
                          ts: 'TypeScript',
                          typescript: 'TypeScript',
                          jsx: 'JSX',
                          tsx: 'TSX',
                          css: 'CSS',
                          scss: 'SCSS',
                          html: 'HTML',
                          json: 'JSON',
                          md: 'Markdown',
                          markdown: 'Markdown',
                          bash: 'Bash',
                          shell: 'Shell',
                          python: 'Python',
                          py: 'Python',
                          java: 'Java',
                          cpp: 'C++',
                          c: 'C',
                          php: 'PHP',
                          sql: 'SQL',
                          xml: 'XML',
                          yaml: 'YAML',
                          yml: 'YAML'
                        }
                      })
                    ]}
                  />
                </div>
              ) : (
                <div className={styles.fallbackContent}>
                  <p>MDXEditor를 불러올 수 없어 원본 마크다운을 표시합니다:</p>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'inherit',
                    background: 'var(--color-surface-secondary)',
                    padding: '16px',
                    borderRadius: '8px',
                    overflow: 'auto'
                  }}>
                    {post.content}
                  </pre>
                </div>
              )}
              
              {/* MDXEditor가 비어있을 경우 fallback 버튼 */}
              <div style={{ marginTop: '16px' }}>
                <button 
                  onClick={handleMdxError}
                  style={{ 
                    padding: '8px 16px', 
                    background: 'var(--color-primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  원본 마크다운 보기
                </button>
              </div>
            </>
          ) : (
            <div className={styles.mdxLoading}>콘텐츠를 불러오는 중...</div>
          )}
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
