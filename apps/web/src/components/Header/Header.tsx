"use client";

import { useEffect, useState } from "react";
import { AuthButton } from "@/components/Auth/AuthButton";
import { ThemeToggle } from "@/components/Theme";
import styles from "./Header.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }

      // 스크롤 상태 감지
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 링크 클릭 시 모바일 메뉴 닫기
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // 모바일 메뉴 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
    }
  };

  // ESC 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 모바일 메뉴가 열렸을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // 메뉴 정보 객체
  const menuItems = [
    {
      href: '/',
      label: 'Home',
      color: 'blue' // 파란색 계열
    },
    {
      href: '/contents',
      label: '게시판',
      color: 'green' // 초록색 계열
    },
    {
      href: '/playground',
      label: 'Playground',
      color: 'yellow' // 노란색 계열
    }
  ];

  // 링크 활성 상태 확인
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`${styles.header} ${
          isScrollingDown ? styles.header__hidden : ""
        } ${isScrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.header__left}>
          <Link href="/" onClick={handleLinkClick}>
            <h1 className={styles.logo}>Dongju&apos;s Portfolio</h1>
          </Link>
          <nav className={styles.header__links}>
            {menuItems.map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`${styles.navLink} ${styles[`navLink--${item.color}`]} ${isActiveLink(item.href) ? styles.active : ''}`}
                onClick={handleLinkClick}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.header__controls}>
          <div className={styles.controlsWrapper}>
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            {isMobileMenuOpen ? (
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            ) : (
              <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            )}
          </svg>
        </button>
      </header>

      {/* 모바일 메뉴 */}
      <div 
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={handleBackdropClick}
      >
        {/* 모바일 메뉴 헤더 */}
        <div className={styles.mobileMenuHeader}>
          <h2 className={styles.mobileMenuTitle}>메뉴</h2>
          <button 
            className={styles.mobileMenuClose}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <nav className={styles.mobileLinks}>
          {menuItems.map((item, index) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${styles.mobileNavLink} ${styles[`mobileNavLink--${item.color}`]} ${isActiveLink(item.href) ? styles.active : ''}`}
              onClick={handleLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.mobileControls}>
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}