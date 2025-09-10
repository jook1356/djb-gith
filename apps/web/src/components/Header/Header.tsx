import { AuthButton } from "@/components/Auth/AuthButton";
import { ThemeToggle } from "@/components/Theme";
import styles from "./Header.module.scss";

export default function Home() {
  return (
    <div className={styles.header}>
      <h1>My Blog</h1>
      <div className={styles.header__controls}>
        <ThemeToggle />
        <AuthButton />
      </div>
    </div>
  );
}
