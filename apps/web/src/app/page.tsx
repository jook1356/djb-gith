import './page.scss';
import { AuthButton } from '@/components/Auth/AuthButton';

export default function Home() {
  return (
   <div className="test">
    <div className="header">
      <h1>My Blog</h1>
      <AuthButton />
    </div>
    <main>
      안녕하세요! GitHub OAuth가 구현된 블로그입니다.
    </main>
   </div>
  );
}
