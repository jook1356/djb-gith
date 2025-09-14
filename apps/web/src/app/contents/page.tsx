'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostViewer from "@/components/Content/PostViewer";
import BoardViewer from "@/components/Content/BoardViewer";
import ContentHome from "@/components/Content/ContentHome";

function ContentRouter() {
  const searchParams = useSearchParams();
  const board = searchParams.get('board');
  const post = searchParams.get('post');

  // 개별 게시글 뷰어
  if (board && post) {
    return <PostViewer boardName={board} postId={decodeURIComponent(post)} />;
  }

  // 게시판 뷰어
  if (board) {
    return <BoardViewer boardName={board} />;
  }

  // 콘텐츠 홈 (모든 게시판 목록)
  return <ContentHome />;
}

export default function ContentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentRouter />
    </Suspense>
  );
}
