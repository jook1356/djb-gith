'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    // httpOnly 쿠키 사용: 토큰은 URL로 전달되지 않음
    // 성공/실패 여부는 창 오픈 성공으로 가정하고 상위 창에서 /auth/user 호출로 확인
    if (window.opener) {
      window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
    }

    // 팝업 창 닫기
    window.close();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          margin: '0 auto 20px'
        }} className="spinner" />
        <p>인증 처리 중...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          잠시 후 이 창이 자동으로 닫힙니다.
        </p>
        <style dangerouslySetInnerHTML={{
          __html: `
            .spinner {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    </div>
  );
}
