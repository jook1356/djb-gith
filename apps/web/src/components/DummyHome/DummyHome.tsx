'use client';

import { useEffect, useRef } from "react";
import styles from "./DummyHome.module.scss";

export default function DummyHome() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer 설정
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    // 애니메이션 대상 요소들 선택
    const animatedElements = document.querySelectorAll(`.${styles.fadeUp}`);
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
      {/* Background Decorations */}
      <div className={styles.backgroundDecorations}>
        <div className={styles.floatingShape} style={{'--delay': '0s', '--x': '10%', '--y': '20%'} as React.CSSProperties}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="var(--color-blue)" opacity="0.1"/>
            <circle cx="30" cy="30" r="20" fill="var(--color-blue)" opacity="0.2"/>
            <circle cx="30" cy="30" r="10" fill="var(--color-blue)" opacity="0.3"/>
          </svg>
        </div>
        <div className={styles.floatingShape} style={{'--delay': '2s', '--x': '85%', '--y': '15%'} as React.CSSProperties}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="10" width="60" height="60" rx="15" fill="var(--color-green)" opacity="0.15"/>
            <rect x="20" y="20" width="40" height="40" rx="10" fill="var(--color-green)" opacity="0.25"/>
          </svg>
        </div>
        <div className={styles.floatingShape} style={{'--delay': '4s', '--x': '75%', '--y': '60%'} as React.CSSProperties}>
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <polygon points="35,5 65,55 5,55" fill="var(--color-yellow)" opacity="0.12"/>
            <polygon points="35,15 55,45 15,45" fill="var(--color-yellow)" opacity="0.2"/>
          </svg>
        </div>
        <div className={styles.floatingShape} style={{'--delay': '1s', '--x': '5%', '--y': '70%'} as React.CSSProperties}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M25 0L35 15L50 25L35 35L25 50L15 35L0 25L15 15Z" fill="var(--color-purple)" opacity="0.15"/>
          </svg>
        </div>
        <div className={styles.floatingShape} style={{'--delay': '3s', '--x': '90%', '--y': '80%'} as React.CSSProperties}>
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <circle cx="22.5" cy="22.5" r="22.5" fill="var(--color-pink)" opacity="0.1"/>
            <rect x="11.25" y="11.25" width="22.5" height="22.5" rx="5" fill="var(--color-pink)" opacity="0.2"/>
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.badge} ${styles.fadeUp}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
            </svg>
            Every Maker, Every Tech
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
            </svg>
          </div>
          <h1 className={`${styles.title} ${styles.fadeUp}`}>
            안녕하세요,
            <br/>
            저는 <span className={styles.highlight}>풀스택 개발자</span>입니다
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeUp}`}>
            코드로 세상을 바꾸는 이야기를 담은 블로그<br/>
            <span className={styles.subtitleAccent}>혁신적인 아이디어와 기술로 더 나은 세상을 만들어갑니다</span>
          </p>
          <div className={`${styles.ctaButtons} ${styles.fadeUp}`}>
            <button className={styles.primaryButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
              </svg>
              블로그 둘러보기
            </button>
            <button className={styles.secondaryButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              포트폴리오 보기
            </button>
            </div>
          <div className={`${styles.heroFeatures} ${styles.fadeUp}`}>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
              </svg>
              <span>실시간 소통</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"/>
              </svg>
              <span>정기 업데이트</span>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
              </svg>
              <span>오픈소스</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${styles.statsSection} ${styles.fadeUp}`}>
        <div className={styles.statsDecoration}>
          <div className={styles.statsPattern}>
            <div className={styles.patternDot} style={{'--color': 'var(--color-blue)'} as React.CSSProperties}></div>
            <div className={styles.patternDot} style={{'--color': 'var(--color-green)'} as React.CSSProperties}></div>
            <div className={styles.patternDot} style={{'--color': 'var(--color-yellow)'} as React.CSSProperties}></div>
          </div>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>커밋</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>5+</div>
            <div className={styles.statLabel}>프로젝트</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>2+</div>
            <div className={styles.statLabel}>년 경력</div>
          </div>
            </div>
      </section>

      {/* Tech Stack Section */}
      <section className={`${styles.techSection} ${styles.fadeUp}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>기술 스택</h2>
          <p className={styles.sectionSubtitle}>다양한 기술로 문제를 해결합니다</p>
          </div>
        <div className={styles.techGrid}>
          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51M9.75 12l.81-1.5-.81-1.5c-.81 1.5-.81 1.5-.81 1.5l.81 1.5M11.13 8.4c.07-.15.14-.29.2-.43-.25-.14-.54-.28-.88-.4l-.22.42c.29.14.59.26.9.41m7.5 11.6c.63-.35.82-1.82.31-3.96-.78.15-1.57.27-2.4.36-.48.67-.99 1.31-1.51 1.9 1.59 1.5 2.97 2.08 3.6 1.7M16.25 12c.27-.45.51-.91.71-1.39L17.25 9c-.2.48-.44.94-.71 1.39.27.45.51.91.71 1.39L17.25 15c-.2-.48-.44-.94-.71-1.39M14.25 16.5c.52-.59 1.03-1.23 1.51-1.9-.83-.09-1.69-.14-2.63-.14-.94 0-1.8.05-2.63.14.48.67.99 1.31 1.51 1.9.56-.02 1.12-.02 1.68 0z" />
              </svg>
            </div>
            <h3>React</h3>
            <p>컴포넌트 기반 UI 개발</p>
            <div className={styles.techLevel}>Expert</div>
          </div>
          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375V9.938z" />
              </svg>
            </div>
            <h3>TypeScript</h3>
            <p>타입 안전한 개발</p>
            <div className={styles.techLevel}>Advanced</div>
          </div>
          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L2.46,6.68C2.376,6.729,2.322,6.825,2.322,6.921v10.15c0,0.097,0.054,0.189,0.137,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
              </svg>
            </div>
            <h3>Node.js</h3>
            <p>서버사이드 JavaScript</p>
            <div className={styles.techLevel}>Advanced</div>
          </div>
          <div className={styles.techCard}>
            <div className={styles.techIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.75 11.35a4.31 4.31 0 00-.79.08 3.69 3.69 0 00-.73-1.77c.1-.4.14-.85.13-1.3a3.7 3.7 0 00-7.4 0c0 .45.03.9.13 1.3a3.69 3.69 0 00-.73 1.77 4.31 4.31 0 00-.79-.08 3.7 3.7 0 000 7.4c.27 0 .54-.03.79-.08a3.69 3.69 0 00.73 1.77c-.1.4-.14.85-.13 1.3a3.7 3.7 0 007.4 0c0-.45-.03-.9-.13-1.3a3.69 3.69 0 00.73-1.77c.25.05.52.08.79.08a3.7 3.7 0 000-7.4zM12 15.7a3.7 3.7 0 110-7.4 3.7 3.7 0 010 7.4z" />
              </svg>
            </div>
            <h3>AWS</h3>
            <p>클라우드 인프라</p>
            <div className={styles.techLevel}>Intermediate</div>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className={`${styles.contentSection} ${styles.fadeUp}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>블로그 컨텐츠</h2>
          <p className={styles.sectionSubtitle}>개발 경험과 인사이트를 공유합니다</p>
        </div>
          <div className={styles.contentGrid}>
            <div className={styles.contentCard}>
              <div className={styles.contentIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3>기술 블로그</h3>
            <p>개발 경험과 인사이트를 공유합니다</p>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.81,14.12L5.64,11.29L8.47,14.12L7.06,15.53L3.5,12L7.06,8.47L8.47,9.88L5.64,12.71L2.81,9.88L1.39,11.29L4.22,14.12L1.39,16.95L2.81,18.36L5.64,15.53L8.47,18.36L9.88,16.95L7.05,14.12L9.88,11.29L8.47,9.88L5.64,12.71L2.81,9.88L1.39,11.29M22.61,11.29L19.78,14.12L22.61,16.95L21.19,18.36L18.36,15.53L15.53,18.36L14.12,16.95L16.95,14.12L14.12,11.29L15.53,9.88L18.36,12.71L21.19,9.88L22.61,11.29Z"/>
              </svg>
            </div>
            <h3>프로젝트 소개</h3>
            <p>흥미로운 프로젝트들을 소개합니다</p>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.contentIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
              </svg>
            </div>
            <h3>성장 이야기</h3>
            <p>개발자로서의 성장 과정을 기록합니다</p>
            </div>
          </div>
      </section>

      {/* Services Section */}
      <section className={`${styles.servicesSection} ${styles.fadeUp}`}>
        <div className={styles.servicesBackground}>
          <div className={styles.meshPattern}>
            <div className={styles.meshLine}></div>
            <div className={styles.meshLine}></div>
            <div className={styles.meshLine}></div>
          </div>
        </div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>제공 서비스</h2>
          <p className={styles.sectionSubtitle}>전문적인 개발 서비스를 제공합니다</p>
        </div>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,7H11L12,9.5L13,7H15L13,12L15,17H13L12,14.5L11,17H9L11,12L9,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
              </svg>
            </div>
            <h3>웹 개발</h3>
            <p>React, Next.js를 활용한 모던 웹 애플리케이션 개발</p>
            <div className={styles.serviceFeatures}>
              <span>반응형 디자인</span>
              <span>SEO 최적화</span>
              <span>성능 최적화</span>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/>
              </svg>
            </div>
            <h3>API 개발</h3>
            <p>Node.js 기반의 확장 가능한 백엔드 시스템 구축</p>
            <div className={styles.serviceFeatures}>
              <span>RESTful API</span>
              <span>데이터베이스 설계</span>
              <span>보안 강화</span>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
            </div>
            <h3>시스템 최적화</h3>
            <p>성능 분석 및 최적화를 통한 사용자 경험 개선</p>
            <div className={styles.serviceFeatures}>
              <span>성능 모니터링</span>
              <span>코드 최적화</span>
              <span>인프라 개선</span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className={`${styles.journeySection} ${styles.fadeUp}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>개발 여정</h2>
          <p className={styles.sectionSubtitle}>지속적인 성장을 추구합니다</p>
      </div>
        <div className={styles.journeyGrid}>
          <div className={styles.journeyCard}>
            <div className={styles.journeyYear}>2025</div>
            <div className={styles.journeyAchievement}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>플랫폼 팀 Lead</span>
            </div>
            <h4>플랫폼 팀으로 입성</h4>
            <p>회사 제품의 가장 Core한 부분을 책임지는 개발자로 성장하며, 팀을 이끌어가는 리더십을 발휘하고 있습니다.</p>
          </div>
          <div className={styles.journeyCard}>
            <div className={styles.journeyYear}>2024</div>
            <div className={styles.journeyAchievement}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
              </svg>
              <span>첫 직장 성공</span>
            </div>
            <h4>VMS Solutions 입사</h4>
            <p>첫 회사에서 기반을 다지며 실무 경험을 쌓고, 다양한 프로젝트를 통해 개발 역량을 키워나갔습니다.</p>
          </div>
          <div className={styles.journeyCard}>
            <div className={styles.journeyYear}>2022-2023</div>
            <div className={styles.journeyAchievement}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,16L3,14L5,12L6.4,13.4L4.8,15L6.4,16.6L5,18L1,14L5,10L6.4,11.4L5,13L7,15L5,16M19,10L23,14L19,18L17.6,16.6L19.2,15L17.6,13.4L19,12L21,14L19,16L17.6,14.6L19,13L17,11L19,10M8.6,22L7.4,22L15.4,2L16.6,2L8.6,22Z"/>
              </svg>
              <span>전국 1등</span>
            </div>
            <h4>삼성 SSAFY 입과</h4>
            <p>전국 1150명 中 1등으로 수료하며 삼성전자 대표이사 상을 수상했습니다. 체계적인 교육과 프로젝트 경험을 통해 개발 실력을 크게 향상시켰습니다.</p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <h3>연락처</h3>
            <p>jook1356@gmail.com</p>
            <p>010-8521-6414</p>
          </div>
            <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
            </a>
            <a href="#" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                </svg>
            </a>
            <a href="#" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/>
                </svg>
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Developer Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
