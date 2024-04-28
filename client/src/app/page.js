"use client";
import styles from "./page.module.css";
import { WithAuth } from "../components/Auth/WithAuth";
import Posts from "../components/Posts/Posts";
import { PostsProvider } from "../contexts/PostsContext";
import { useState } from "react";

const Home = () => {
  const [feedType, setFeedType] = useState("discover");

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.feedTypeButtons}>
          <button
            onClick={() => setFeedType("discover")}
            className={`${styles.feedTypeButton} ${
              feedType == "discover" ? styles.feedTypeButtonActive : ""
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setFeedType("friends")}
            className={`${styles.feedTypeButton} ${
              feedType == "friends" ? styles.feedTypeButtonActive : ""
            }`}
          >
            Friends
          </button>
        </div>
        <PostsProvider postType={feedType}>
          <Posts />
        </PostsProvider>
      </div>
    </main>
  );
};

export default WithAuth(Home);
