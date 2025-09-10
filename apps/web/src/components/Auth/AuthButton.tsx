"use client";

import React from "react";
import { useAuthContext } from "./AuthProvider";
import styles from "./AuthButton.module.scss";
import { Button } from "../Button/Button";

export function AuthButton() {
  const { user, loading, login, logout } = useAuthContext();

  if (loading) {
    return (
      <div className={styles.authButton}>
        <span className={styles.loading}>Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.authButton}>
        <div className={styles.userInfo}>
          <img
            src={user.avatar_url}
            alt={user.login}
            className={styles.avatar}
          />
          <span className={styles.username}>{user.login}</span>
        </div>
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className={styles.authButton}>
      <Button onClick={login} size="large">Login with GitHub</Button>
    </div>
  );
}
