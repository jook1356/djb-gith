'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    // URL에서 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (window.opener) {
      // 부모 창에 메시지 전달 (origin은 현재 origin 사용)
      const targetOrigin = window.location.origin;
      
      if (token) {
        window.opener.postMessage({ 
          type: 'AUTH_SUCCESS', 
          token 
        }, targetOrigin);
      } else if (error) {
        window.opener.postMessage({ 
          type: 'AUTH_ERROR', 
          error 
        }, targetOrigin);
      } else {
        window.opener.postMessage({ 
          type: 'AUTH_ERROR', 
          error: 'No token received' 
        }, targetOrigin);
      }
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
