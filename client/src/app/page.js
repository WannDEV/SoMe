"use client";
import styles from "./page.module.css";
import { withAuth } from "../components/Auth/WithAuth";
import Posts from "../components/Posts/Posts";
import FriendsSideBar from "../components/FriendsSideBar/FriendsSideBar";
import NavigationSideBar from "../components/NavigationSideBar/NavigationSideBar";
import { PostsProvider } from "../contexts/PostsContext";

const Home = () => {
  return (
    <main>
      <div className={styles.container}>
        <NavigationSideBar />
        <PostsProvider>
          <Posts />
        </PostsProvider>
        <FriendsSideBar />
      </div>
    </main>
  );
};

export default withAuth(Home);
