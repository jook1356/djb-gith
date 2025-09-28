'use client';

import React, { useState, useEffect } from 'react';
import BoardViewerMobile from './BoardViewerMobile';
import BoardViewerDesktop from './BoardViewerDesktop';

interface BoardViewerProps {
  boardName: string;
}

export default function BoardViewer({ boardName }: BoardViewerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // 모바일/데스크톱에 따라 적절한 컴포넌트 렌더링
  if (isMobile) {
    return <BoardViewerMobile boardName={boardName} />;
  } else {
    return <BoardViewerDesktop boardName={boardName} />;
  }
}
