import styles from "./DummyHome.module.scss";

export default function DummyHome() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            
            안녕하세요,
            <span className={styles.wave}>👋</span>
            <br/>
            저는 <span className={styles.highlight}>개발자</span>입니다
          </h1>
          <p className={styles.subtitle}>
            코드로 세상을 바꾸는 이야기를 담은 블로그
          </p>
          <div className={styles.comingSoon}>
            <span className={styles.comingSoonText}>Coming Soon...</span>
            <div className={styles.dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.floatingCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.codeLine}>
                <span className={styles.keyword}>const</span>
                <span className={styles.variable}> blog</span>
                <span className={styles.operator}> = </span>
                <span className={styles.string}>'amazing'</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.keyword}>function</span>
                <span className={styles.function}> createContent</span>
                <span className={styles.bracket}>()</span>
                <span className={styles.bracket}> {'{'}</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.indent}>  </span>
                <span className={styles.keyword}>return</span>
                <span className={styles.string}> 'inspiration'</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.bracket}>{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📝</div>
          <h3>기술 블로그</h3>
          <p>개발 경험과 인사이트를 공유합니다</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💡</div>
          <h3>프로젝트 소개</h3>
          <p>흥미로운 프로젝트들을 소개합니다</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🚀</div>
          <h3>성장 이야기</h3>
          <p>개발자로서의 성장 과정을 기록합니다</p>
        </div>
      </div>

      <div className={styles.footer}>
        <p>곧 멋진 블로그로 찾아뵙겠습니다!</p>
        <div className={styles.socialLinks}>
          <div className={styles.socialIcon}>💻</div>
          <div className={styles.socialIcon}>📧</div>
          <div className={styles.socialIcon}>🐱</div>
        </div>
      </div>
    </div>
  );
}
