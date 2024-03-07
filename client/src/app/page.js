"use client";
import styles from "./page.module.css";
import { withAuth } from "../components/Auth/WithAuth";
import CreatePostCard from "../components/CreatePost/CreatePostCard";

const Home = () => {
  return (
    <main>
      <div className={styles.container}>
        <div></div>
        <div>
          <CreatePostCard />
        </div>
        <div></div>
      </div>
    </main>
  );
};

export default withAuth(Home);
