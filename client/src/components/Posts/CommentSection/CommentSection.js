import { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";
import Comment from "../Comment/Comment";
import styles from "./CommentSection.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { IoSend } from "react-icons/io5";
import { useAuth } from "../../../contexts/AuthContext";

const CommentSection = ({
  post,
  showComments,
  setShowComments,
  commentsCount,
  setCommentsCount,
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const textareaRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!showComments) return;
    api
      .get(`post-interaction/${post.post_id}/comments`)
      .then((response) => {
        // handle success
        console.log("Comments fetched:", response.data);
        setComments(response.data);
      })
      .catch((error) => {
        // handle error
        console.error("Error fetching comments:", error);
      });
  }, [showComments, post.post_id]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if (event.target.value === "") {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSendComment = () => {
    if (comment.trim() !== "") {
      api
        .post(`post-interaction/${post.post_id}/comment`, { content: comment })
        .then((response) => {
          // handle success
          console.log("Comment sent:", response.data);
          // Clear the input field after sending the comment
          setComment("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
          const newComment = {
            ...response.data,
            username: user.username,
            profile_picture: user.profilePicture,
          };
          setComments([...comments, newComment]);
          setCommentsCount(parseInt(commentsCount) + 1);
          setShowComments(true);
        })
        .catch((error) => {
          // handle error
          console.error("Error sending comment:", error);
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default Enter key behavior
      handleSendComment();
      setComment("");
    }
  };

  return (
    <div>
      <div className={styles.CommentsContainer}>
        {showComments &&
          comments.map((comment) => (
            <Comment
              key={comment.comment_id}
              comment={comment}
              postId={post.post_id}
              setComments={setComments}
              comments={comments}
              setCommentsCount={setCommentsCount}
              commentsCount={commentsCount}
            />
          ))}
        {showComments && comments.length === 0 && (
          <p className={styles.noComments}>No comments yet</p>
        )}
      </div>
      <div className={styles.WriteCommentContainer}>
        <ProfilePicture
          src={user.profilePicture}
          style={{ marginRight: "0.5rem" }}
        />
        <div className={styles.WriteCommentInputContainer}>
          <textarea
            placeholder="Write a comment..."
            className={styles.WriteCommentInput}
            value={comment}
            onChange={handleCommentChange}
            ref={textareaRef}
            rows={1}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendComment}
            disabled={comment.trim() === ""}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
