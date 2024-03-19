import { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import PostCard from "./PostCard/PostCard";
import api from "../../utils/api";
import CreatePostCard from "./CreatePost/CreatePostCard";
import { AiOutlineInbox } from "react-icons/ai";
import { usePosts } from "../../contexts/PostsContext";

const Posts = () => {
  const { posts, loading } = usePosts();

  return (
    <div className={styles.container}>
      <CreatePostCard />
      {!loading && posts.length === 0 && (
        <div className={styles.noPosts}>
          <AiOutlineInbox size={100} />
          <h2>No posts to show</h2>
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
