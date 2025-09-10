import styles from "./DummyHome.module.scss";

export default function DummyHome() {
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
          {Array.from({length: 20}).map((_, i) => (
            <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}></div>
          ))}
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✨ 개발자 포트폴리오 ✨</div>
          <h1 className={styles.title}>
            안녕하세요,
            <span className={styles.wave}>👋</span>
            <br/>
            저는 <span className={styles.highlight}>풀스택 개발자</span>입니다
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.typewriter}>코드로 세상을 바꾸는 이야기를 담은 블로그</span>
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>커밋</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>프로젝트</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3+</span>
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
                  <span className={styles.bracket}>{'{'}</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>2</span>
                  <span className={styles.indent}>  </span>
                  <span className={styles.property}>name</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.string}>'김개발자'</span>
                  <span className={styles.operator}>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>3</span>
                  <span className={styles.indent}>  </span>
                  <span className={styles.property}>skills</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.bracket}>[</span>
                  <span className={styles.string}>'React'</span>
                  <span className={styles.operator}>, </span>
                  <span className={styles.string}>'Node.js'</span>
                  <span className={styles.bracket}>]</span>
                  <span className={styles.operator}>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>4</span>
                  <span className={styles.indent}>  </span>
                  <span className={styles.property}>passion</span>
                  <span className={styles.operator}>: </span>
                  <span className={styles.string}>'∞'</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.lineNumber}>5</span>
                  <span className={styles.bracket}>{'}'}</span>
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

      <div className={styles.techStack}>
        <h2 className={styles.sectionTitle}>🛠️ 기술 스택</h2>
        <div className={styles.techGrid}>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>⚛️</div>
            <span>React</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>📘</div>
            <span>TypeScript</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>🟢</div>
            <span>Node.js</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>🍃</div>
            <span>MongoDB</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>🐳</div>
            <span>Docker</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>☁️</div>
            <span>AWS</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>🔥</div>
            <span>Firebase</span>
          </div>
          <div className={styles.techItem}>
            <div className={styles.techIcon}>📱</div>
            <span>React Native</span>
          </div>
        </div>
      </div>
      
      <div className={styles.features}>
        <h2 className={styles.sectionTitle}>📚 블로그 컨텐츠</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3>기술 블로그</h3>
            <p>개발 경험과 인사이트를 공유합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>React</span>
              <span className={styles.tag}>JavaScript</span>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💡</div>
            <h3>프로젝트 소개</h3>
            <p>흥미로운 프로젝트들을 소개합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Portfolio</span>
              <span className={styles.tag}>Open Source</span>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>성장 이야기</h3>
            <p>개발자로서의 성장 과정을 기록합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Career</span>
              <span className={styles.tag}>Learning</span>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔧</div>
            <h3>개발 팁</h3>
            <p>실무에서 유용한 개발 팁과 트릭을 공유합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Tips</span>
              <span className={styles.tag}>Best Practice</span>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌐</div>
            <h3>웹 트렌드</h3>
            <p>최신 웹 개발 트렌드와 기술을 분석합니다</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Trends</span>
              <span className={styles.tag}>Analysis</span>
            </div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤝</div>
            <h3>커뮤니티</h3>
            <p>개발자 커뮤니티 활동과 네트워킹 이야기</p>
            <div className={styles.cardFooter}>
              <span className={styles.tag}>Community</span>
              <span className={styles.tag}>Networking</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.timeline}>
        <h2 className={styles.sectionTitle}>🛤️ 개발 여정</h2>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2024</div>
            <div className={styles.timelineContent}>
              <h4>풀스택 개발자로 성장</h4>
              <p>React, Node.js를 활용한 다양한 프로젝트 경험</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2023</div>
            <div className={styles.timelineContent}>
              <h4>첫 오픈소스 기여</h4>
              <p>오픈소스 프로젝트에 기여하며 협업 경험 쌓기</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2022</div>
            <div className={styles.timelineContent}>
              <h4>개발자 커리어 시작</h4>
              <p>첫 회사에서 웹 개발의 기초를 다지기</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>연락처</h3>
            <p>📧 developer@example.com</p>
            <p>📱 010-1234-5678</p>
          </div>
          <div className={styles.footerSection}>
            <h3>소셜 미디어</h3>
            <div className={styles.socialLinks}>
              <div className={styles.socialIcon}>💻</div>
              <div className={styles.socialIcon}>📧</div>
              <div className={styles.socialIcon}>🐱</div>
              <div className={styles.socialIcon}>📘</div>
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
          <p>&copy; 2024 Developer Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}