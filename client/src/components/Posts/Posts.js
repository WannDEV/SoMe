import { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import PostCard from "../PostCard/PostCard";
import api from "../../utils/api";
import CreatePostCard from "../CreatePost/CreatePostCard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("post-management/posts");
        console.log(response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <CreatePostCard setPosts={setPosts} posts={posts} />
      {!loading && posts.length === 0 && <h2>No posts to show</h2>}
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
