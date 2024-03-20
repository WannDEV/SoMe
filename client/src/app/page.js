"use client";
import styles from "./page.module.css";
import { WithAuth } from "../components/Auth/WithAuth";
import Posts from "../components/Posts/Posts";
import { PostsProvider } from "../contexts/PostsContext";

const Home = () => {
  return (
    <main>
      <div className={styles.container}>
        <PostsProvider>
          <Posts />
        </PostsProvider>
      </div>
    </main>
  );
};

export default WithAuth(Home);
