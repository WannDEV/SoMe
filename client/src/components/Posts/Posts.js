import styles from "./Posts.module.css";
import PostCard from "./PostCard/PostCard";
import CreatePostCard from "./CreatePost/CreatePostCard";
import { AiOutlineInbox } from "react-icons/ai";
import { usePosts } from "../../contexts/PostsContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Posts = (props) => {
  const { posts, loading } = usePosts();

  return (
    <div className={styles.container}>
      <CreatePostCard hide={props.hideCreatePost} />
      {!loading && posts.length === 0 && (
        <div className={styles.noPosts}>
          <AiOutlineInbox size={100} />
          <h2>No posts to show</h2>
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
      {loading && (
        <Skeleton count={3} height={200} className={styles.postSkeleton} />
      )}
    </div>
  );
};

export default Posts;
