import './page.scss';
import LoginButton from '@/components/LoginButton';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1>My Blog</h1>
        <LoginButton />
      </header>
      
      <main className="main-content">
        <ProtectedRoute>
          <div className="welcome-section">
            <h2>환영합니다!</h2>
            <p>GitHub OAuth 인증이 완료되었습니다.</p>
            <p>이제 블로그의 모든 기능을 사용할 수 있습니다.</p>
          </div>
          
          <div className="blog-content">
            <article className="blog-post">
              <h3>첫 번째 포스트</h3>
              <p>이것은 보호된 콘텐츠입니다. 로그인한 사용자만 볼 수 있습니다.</p>
              <p>GitHub OAuth를 통해 안전하게 인증된 사용자에게만 표시됩니다.</p>
            </article>
          </div>
        </ProtectedRoute>
      </main>
    </div>
  );
}
