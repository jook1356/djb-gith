'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // URL에서 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost && window.opener) {
      // 로컬 개발 환경: 팝업 방식 - 부모 창에 메시지 전달
      if (token) {
        window.opener.postMessage({ 
          type: 'AUTH_SUCCESS', 
          token 
        }, window.location.origin);
      } else if (error) {
        window.opener.postMessage({ 
          type: 'AUTH_ERROR', 
          error 
        }, window.location.origin);
      } else {
        window.opener.postMessage({ 
          type: 'AUTH_ERROR', 
          error: 'No token received' 
        }, window.location.origin);
      }
      // 팝업 창 닫기
      window.close();
    } else {
      // GitHub Pages 환경: 직접 리다이렉트 방식
      // useAuth 훅에서 토큰을 처리하므로 잠시 대기 후 메인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [router]);

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
          {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? '잠시 후 이 창이 자동으로 닫힙니다.'
            : '잠시 후 메인 페이지로 이동합니다.'
          }
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
