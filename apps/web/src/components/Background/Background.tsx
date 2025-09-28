'use client';

import { useEffect, useRef } from "react";
import styles from "./Background.module.scss";

export default function Background() {
  return (
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
  );
}
