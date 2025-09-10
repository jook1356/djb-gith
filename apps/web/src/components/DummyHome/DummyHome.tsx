import styles from "./DummyHome.module.scss";

export default function DummyHome() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.sparkles}>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
          <div className={styles.sparkle}></div>
        </div>
        <h1 className={styles.rainbowTitle}>
          <span className={styles.glitch} data-text="개발자의">
            개발자의
          </span>
          <span className={styles.neon}> 작은 일상과 </span>
          <span className={styles.holographic}>기록</span>
        </h1>
        <p className={styles.glowingText}>
          코딩하며 배운 것들, 일상의 소소한 이야기, 그리고 성장하는 과정을
          기록하는 개인적인 공간입니다.
          <br />
          <span className={styles.twinkle}>✨</span> 방문해주셔서 감사합니다.
          천천히 둘러보세요 <span className={styles.twinkle}>✨</span>
        </p>
        <div className={styles.floatingElements}>
          <div className={styles.floatingShape}>🚀</div>
          <div className={styles.floatingShape}>💫</div>
          <div className={styles.floatingShape}>⭐</div>
          <div className={styles.floatingShape}>🌟</div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <span>💻</span>
          </div>
          <h3>개발 노트</h3>
          <p>
            새로 배운 기술, 문제 해결 과정, 코드 스니펫을 정리하여 나중에 다시
            찾아볼 수 있도록 기록합니다.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <span>📝</span>
          </div>
          <h3>일상 기록</h3>
          <p>
            개발자로서의 성장 과정, 프로젝트 회고, 그리고 소소한 일상을
            마크다운으로 정리하는 공간입니다.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <span>🌙</span>
          </div>
          <h3>편안한 읽기</h3>
          <p>
            다크/라이트 테마로 언제나 편안하게 글을 읽을 수 있으며, 모든
            기기에서 최적화된 경험을 제공합니다.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.icon}>
            <span>🔍</span>
          </div>
          <h3>검색 & 정리</h3>
          <p>
            카테고리별 분류와 태그 시스템으로 과거에 작성한 글들을 쉽게 찾고
            관리할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2>최신 글 둘러보기</h2>
        <p>새로운 인사이트와 개발 경험을 공유합니다.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.ctaButton}>
            <span>📚</span>전체 글 보기
          </button>
          <button className={styles.ctaButtonSecondary}>
            <span>🏷️</span>카테고리별 보기
          </button>
        </div>
      </section>

      {/* Recent Topics */}
      <section className={styles.topics}>
        <h2>주요 주제들</h2>
        <div className={styles.topicTags}>
          <div className={styles.topicTag}>React</div>
          <div className={styles.topicTag}>Next.js</div>
          <div className={styles.topicTag}>TypeScript</div>
          <div className={styles.topicTag}>개발일기</div>
          <div className={styles.topicTag}>문제해결</div>
          <div className={styles.topicTag}>프로젝트</div>
          <div className={styles.topicTag}>회고</div>
          <div className={styles.topicTag}>TIL</div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quote}>
        <div className={styles.quoteIcon}>💭</div>
        <blockquote>
          "코드를 작성하는 것은 예술이고, 문제를 해결하는 것은 과학이며,
          <br />그 과정을 기록하는 것은 성장의 증거입니다."
        </blockquote>
        <cite>— 개발하는 일상에서</cite>
      </section>
    </div>
  );
}
