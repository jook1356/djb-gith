import { AuthButton } from "@/components/Auth/AuthButton";
import { ThemeToggle } from "@/components/Theme";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
      <h1>My Blog</h1>
      <div className={styles.header__controls}>
        <AuthButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
