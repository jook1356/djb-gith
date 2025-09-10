"use client";


import { useEffect, useState } from "react";
import { AuthButton } from "@/components/Auth/AuthButton";
import { ThemeToggle } from "@/components/Theme";
import styles from "./Header.module.scss";

export default function Header() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 스크롤 다운
        setIsScrollingDown(true);
      } else {
        // 스크롤 업
        setIsScrollingDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`${styles.header} ${
        isScrollingDown ? styles.header__hidden : ""
      }`}
    >
      <h1>Dongju&apos;s Portfolio</h1>
      <div className={styles.header__controls}>
        <AuthButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
