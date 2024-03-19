import { useState } from "react";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import styles from "./PostCard.module.css";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { formatTimestampToDate } from "../../../utils/formatTimestamp";
import CommentSection from "../CommentSection/CommentSection";
import api from "../../../utils/api";
import Image from "next/image";
import MenuBar from "../../MenuBar/MenuBar";
import { IoIosMore } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { usePosts } from "../../../contexts/PostsContext";

const PostCard = (props) => {
  const post = props.post;
  const [liked, setLiked] = useState(post.has_liked);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isOpen, setIsOpen] = useState(false);
  const { removePost } = usePosts();

  const handleLike = () => {
    if (!liked == true) {
      // handle add like
      api
        .post(`http://localhost:2000/post-interaction/${post.post_id}/like`)
        .then((response) => {
          // handle success
          console.log("Like added:", response.data);
          post.likes_count++;
          setLiked(!liked);
        })
        .catch((error) => {
          // handle error
          console.error("Error adding like:", error);
        });
    } else {
      // function to handle remove like
      api
        .delete(`http://localhost:2000/post-interaction/${post.post_id}/like`)
        .then((response) => {
          // handle success
          console.log("Like removed:", response.data);
          post.likes_count--;
          setLiked(!liked);
        })
        .catch((error) => {
          // handle error
          console.error("Error removing like:", error);
        });
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <ProfilePicture
          src={post.profile_picture}
          style={{ marginRight: "0.5rem" }}
        />
        <div>
          <h4>{post.username}</h4>
          <p>{formatTimestampToDate(post.post_date)}</p>
        </div>
        <div className={styles.dropDownMenu}>
          <MenuBar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerComponent={
              <button className={styles.dropDownMenuButton}>
                <IoIosMore size={24} />
              </button>
            }
          >
            <ul>
              <li
                onClick={() => removePost(post.post_id)}
                className={styles.deletePost}
              >
                <MdDelete size={24} />
                Delete Post
              </li>
            </ul>
          </MenuBar>
        </div>
      </div>
      <div className={styles.content}>
        {post.content && (
          <p>
            {post.content.length <= 300 || showMore === true
              ? post.content
              : `${post.content.substring(0, 300)}... `}
            {post.content.length > 300 && !showMore && (
              <span
                onClick={() => setShowMore(true)}
                className={styles.showMore}
              >
                Show more
              </span>
            )}
          </p>
        )}
        <div className={styles.imageContainer}>
          {post.img && (
            <Image
              src={post.img}
              alt="Post"
              width={500} // Adjust as needed
              height={300} // Adjust as needed
              layout="responsive"
            />
          )}
        </div>
      </div>
      <hr />
      <div className={styles.actionButtons}>
        <span style={{ display: "flex" }}>
          <button
            onClick={handleLike}
            className={`${liked ? styles.isLiked : ""}`}
          >
            {liked ? <AiFillLike size={24} /> : <AiOutlineLike size={24} />}{" "}
            <p>{post.likes_count}</p>
          </button>
          <button
            onClick={handleComment}
            className={`${showComments ? styles.isCommentSectionActive : ""}`}
          >
            {showComments ? (
              <FaCommentDots size={24} />
            ) : (
              <FaRegCommentDots size={24} />
            )}
            <p>{commentsCount}</p>
          </button>
        </span>
        <button>
          <CiShare2 size={24} /> <p>{post.shares_count}</p>
        </button>
      </div>
      <hr />
      <CommentSection
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        commentsCount={commentsCount}
        setCommentsCount={setCommentsCount}
      />
    </div>
  );
};

export default PostCard;
