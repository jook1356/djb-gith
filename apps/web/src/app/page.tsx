import "./page.scss";
import { AuthButton } from "@/components/Auth/AuthButton";
import { Button } from "@/components/Button/Button";
import { ThemeToggle } from "@/components/Theme";

export default function Home() {
  return (
    <div className="test">
      <div className="header">
        <h1>My Blog</h1>
        <div className="header__controls">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
      <main>
        안녕하세요! GitHub OAuth가 구현된 블로그입니다.
        <Button>Test</Button>
      </main>
    </div>
  );
}
