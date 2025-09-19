"use client";

import { useEffect, useRef } from "react";
import { useViewport } from "@/components/Viewport";
import styles from "./DummyHome.module.scss";

export default function DummyHome() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { viewport, isMobile, isTablet, isDesktop } = useViewport();

  useEffect(() => {
    // Intersection Observer 설정
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        } else {
          entry.target.classList.remove(styles.visible);
        }
      });
    }, observerOptions);

    // 애니메이션 대상 요소들 선택
    const animatedElements = document.querySelectorAll(`.${styles.scrollFade}`);
    animatedElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  return (
    <div className={styles.container}>
      {/* 배경 동적 요소들 */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
        <div className={styles.floatingShape4}></div>
        <div className={styles.floatingShape5}></div>
        <div className={styles.particles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`${styles.particle} ${styles[`particle${i + 1}`]}`}
            ></div>
          ))}
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✨ 개발자 포트폴리오 ✨</div>
          <h1 className={styles.title}>
            안녕하세요,
            <span className={styles.wave}>👋</span>
            <br />
            저는 <span className={styles.highlight}>풀스택 개발자</span>입니다
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.typewriter}>
              코드로 세상을 바꾸는 이야기를 담은 블로그
            </span>
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>커밋</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>프로젝트</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>2+</span>
              <span className={styles.statLabel}>년 경력</span>
            </div>
          </div>
          <div className={styles.comingSoon}>
            <span className={styles.comingSoonText}>🚀 Coming Soon...</span>
            <div className={styles.dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* ViewportProvider 테스트 인디케이터 */}
          <div className={styles.viewportIndicator}>
            <span className={styles.viewportLabel}>현재 뷰포트:</span>
            <span
              className={`${styles.viewportValue} ${
                styles[`viewport-${viewport}`]
              }`}
            >
              {viewport === "mobile" && "📱 모바일"}
              {viewport === "tablet" && "📟 태블릿"}
              {viewport === "desktop" && "🖥️ 데스크톱"}
            </span>
            {isMobile && (
              <span className={styles.deviceInfo}>
                • 모바일 전용 기능 활성화
              </span>
            )}
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.codeContainer}>
            <div className={styles.floatingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.fileName}>portfolio.js</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>1</span>
                  <span className={styles.keyword}>const</span>
                  <span className={styles.variable}> developer</span>
                  <span className={styles.operator}> = </span>
                  <span className={styles.bracket}>{"{"}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>2</span>
                  <span className={styles.indent}> </span>
                  <span className={styles.property}>name</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.string}>&apos;김개발자&apos;</span>
                  <span className={styles.operator}>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>3</span>
                  <span className={styles.indent}> </span>
                  <span className={styles.property}>skills</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.bracket}>[</span>
                  <span className={styles.string}>&apos;React&apos;</span>
                  <span className={styles.operator}>, </span>
                  <span className={styles.string}>&apos;Node.js&apos;</span>
                  <span className={styles.bracket}>]</span>
                  <span className={styles.operator}>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>4</span>
                  <span className={styles.indent}> </span>
                  <span className={styles.property}>passion</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.string}>&apos;∞&apos;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>5</span>
                  <span className={styles.bracket}>{"}"}</span>
                </div>
              </div>
            </div>
            <div className={styles.terminalCard}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.terminalTitle}>terminal</span>
              </div>
              <div className={styles.terminalContent}>
                <div className={styles.terminalLine}>
                  <span className={styles.prompt}>$</span>
                  <span className={styles.command}>npm run build</span>
                </div>
                <div className={styles.terminalLine}>
                  <span className={styles.output}>✅ Build successful!</span>
                </div>
                <div className={styles.terminalLine}>
                  <span className={styles.prompt}>$</span>
                  <span className={styles.command}>git push origin main</span>
                </div>
                <div className={styles.terminalLine}>
                  <span className={styles.cursor}>_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.techStack} ${styles.scrollFade}`}>
        <h2 className={styles.sectionTitle}>🛠️ 기술 스택</h2>
        <div className={styles.techGrid}>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51M9.75 12l.81-1.5-.81-1.5c-.81 1.5-.81 1.5-.81 1.5l.81 1.5M11.13 8.4c.07-.15.14-.29.2-.43-.25-.14-.54-.28-.88-.4l-.22.42c.29.14.59.26.9.41m7.5 11.6c.63-.35.82-1.82.31-3.96-.78.15-1.57.27-2.4.36-.48.67-.99 1.31-1.51 1.9 1.59 1.5 2.97 2.08 3.6 1.7M16.25 12c.27-.45.51-.91.71-1.39L17.25 9c-.2.48-.44.94-.71 1.39.27.45.51.91.71 1.39L17.25 15c-.2-.48-.44-.94-.71-1.39M14.25 16.5c.52-.59 1.03-1.23 1.51-1.9-.83-.09-1.69-.14-2.63-.14-.94 0-1.8.05-2.63.14.48.67.99 1.31 1.51 1.9.56-.02 1.12-.02 1.68 0z" />
              </svg>
            </div>
            <span>React</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375V9.938z" />
              </svg>
            </div>
            <span>TypeScript</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L2.46,6.68C2.376,6.729,2.322,6.825,2.322,6.921v10.15c0,0.097,0.054,0.189,0.137,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
              </svg>
            </div>
            <span>Node.js</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
              </svg>
            </div>
            <span>MongoDB</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
              </svg>
            </div>
            <span>Docker</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.75 11.35a4.31 4.31 0 00-.79.08 3.69 3.69 0 00-.73-1.77c.1-.4.14-.85.13-1.3a3.7 3.7 0 00-7.4 0c0 .45.03.9.13 1.3a3.69 3.69 0 00-.73 1.77 4.31 4.31 0 00-.79-.08 3.7 3.7 0 000 7.4c.27 0 .54-.03.79-.08a3.69 3.69 0 00.73 1.77c-.1.4-.14.85-.13 1.3a3.7 3.7 0 007.4 0c0-.45-.03-.9-.13-1.3a3.69 3.69 0 00.73-1.77c.25.05.52.08.79.08a3.7 3.7 0 000-7.4zM12 15.7a3.7 3.7 0 110-7.4 3.7 3.7 0 010 7.4z" />
              </svg>
            </div>
            <span>AWS</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.803 21.803c0 .11-.1.197-.197.197H2.197A.193.193 0 012 21.803V2.197C2 2.087 2.1 2 2.197 2h3.409c.098 0 .197.088.197.197v19.606zM22 2.197C22 2.087 21.9 2 21.803 2h-3.409A.193.193 0 0018.197 2.197v19.606c0 .11.1.197.197.197h3.409c.098 0 .197-.088.197-.197V2.197zM13.75 2.197C13.75 2.087 13.65 2 13.553 2H10.447c-.098 0-.197.088-.197.197v19.606c0 .11.1.197.197.197h3.106c.098 0 .197-.088.197-.197V2.197z" />
              </svg>
            </div>
            <span>Firebase</span>
          </div>
          <div className={`${styles.techItem} ${styles.scrollFade}`}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.5 15.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S13 13.17 13 14s.67 1.5 1.5 1.5zm-5 0c.83 0 1.5-.67 1.5-1.5S10.33 12.5 9.5 12.5 8 13.17 8 14s.67 1.5 1.5 1.5zM12 20.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM12 3.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zM18.36 16.95c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06z" />
              </svg>
            </div>
            <span>React Native</span>
          </div>
        </div>
      </div>

      <div className={`${styles.features} ${styles.scrollFade}`}>
        <h2 className={styles.sectionTitle}>📚 블로그 컨텐츠</h2>
        <div className={styles.featureGrid}>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3>기술 블로그</h3>
            <p>개발 경험과 인사이트를 공유합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>React</span>
              <span className={styles.tag}>JavaScript</span>
            </div>
          </div>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
              </svg>
            </div>
            <h3>프로젝트 소개</h3>
            <p>흥미로운 프로젝트들을 소개합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Portfolio</span>
              <span className={styles.tag}>Open Source</span>
            </div>
          </div>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </div>
            <h3>성장 이야기</h3>
            <p>개발자로서의 성장 과정을 기록합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Career</span>
              <span className={styles.tag}>Learning</span>
            </div>
          </div>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
              </svg>
            </div>
            <h3>개발 팁</h3>
            <p>실무에서 유용한 개발 팁과 트릭을 공유합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Tips</span>
              <span className={styles.tag}>Best Practice</span>
            </div>
          </div>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
            </div>
            <h3>웹 트렌드</h3>
            <p>최신 웹 개발 트렌드와 기술을 분석합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Trends</span>
              <span className={styles.tag}>Analysis</span>
            </div>
          </div>
          <div className={`${styles.featureCard} ${styles.scrollFade}`}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
              </svg>
            </div>
            <h3>커뮤니티</h3>
            <p>개발자 커뮤니티 활동과 네트워킹 이야기</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Community</span>
              <span className={styles.tag}>Networking</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.timeline} ${styles.scrollFade}`}>
        <h2 className={styles.sectionTitle}>🛤️ 개발 여정</h2>
        <div className={styles.timelineContainer}>
          <div className={`${styles.timelineItem} ${styles.scrollFade}`}>
            <div className={styles.timelineDate}>2025</div>
            <div className={styles.timelineContent}>
              <h4>플랫폼 팀으로 입성</h4>
              <p>회사 제품의 가장 Core한 부분을 책임지는 개발자로 성장</p>
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.scrollFade}`}>
            <div className={styles.timelineDate}>2024</div>
            <div className={styles.timelineContent}>
              <h4>VMS Solutions 입사</h4>
              <p>첫 회사에서 기반을 다지다</p>
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.scrollFade}`}>
            <div className={styles.timelineDate}>2022 ~ 2023</div>
            <div className={styles.timelineContent}>
              <h4>삼성 SSAFY 입과</h4>
              <p>전국 1150명 中 1등, 삼성전자 대표이사 상 수상</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>연락처</h3>
            <p>📧 jook1356@gmail.com</p>
            <p>📱 010-8521-6414</p>
          </div>
          <div className={styles.footerSection}>
            <h3>소셜 미디어</h3>
            <div className={styles.socialLinks}>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                </svg>
              </div>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                </svg>
              </div>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </div>
              <div className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.footerSection}>
            <h3>블로그 오픈 예정</h3>
            <p>곧 멋진 블로그로 찾아뵙겠습니다!</p>
            <div className={styles.newsletter}>
              <input
                type="email"
                placeholder="이메일 주소"
                className={styles.emailInput}
                disabled
              />
              <button className={styles.subscribeBtn} disabled>
                알림 받기
              </button>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Developer Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
