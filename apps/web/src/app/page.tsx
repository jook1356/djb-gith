import Header from "@/components/Header/Header";
import React from "react";
import styles from "./page.module.scss";
import DummyHome from "@/components/DummyHome/DummyHome";

export default function Home() {
  return (
    <React.Fragment>
      <Header />
      <div className={styles["main"]}>
        <div className={styles["content-wrapper"]}>
          <div className={styles["content"]}>
            <DummyHome/>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
