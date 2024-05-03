import { useState, useEffect, useRef } from "react";
import api from "../../../utils/api";
import Comment from "../Comment/Comment"; // Import af kommentar-komponenten
import styles from "./CommentSection.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { IoSend } from "react-icons/io5"; // Import af ikon til afsendelse af kommentarer
import { useAuth } from "../../../contexts/AuthContext"; // Import af hook til autentificering

const CommentSection = ({
  post,
  showComments,
  setShowComments,
  commentsCount,
  setCommentsCount,
}) => {
  const [comment, setComment] = useState(""); // Tilstand for den aktuelle kommentar
  const [comments, setComments] = useState([]); // Tilstand for alle kommentarer på posten
  const textareaRef = useRef(null); // Reference til textarea-elementet
  const { user } = useAuth(); // Brugerautentificeringsdata

  // Effekt til at hente kommentarer fra API'en
  useEffect(() => {
    if (!showComments) return;
    api
      .get(`post-interaction/${post.post_id}/comments`)
      .then((response) => {
        console.log("Comments fetched:", response.data);
        setComments(response.data.reverse()); // Omvendt rækkefølge for at vise nyeste kommentarer først
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [showComments, post.post_id]);

  // Håndtering af ændringer i kommentarteksten
  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Automatisk justering af textarea-højde
    }
    if (event.target.value === "") {
      textareaRef.current.style.height = "auto"; // Gendan standardhøjden, hvis teksten er tom
    }
  };

  // Håndtering af afsendelse af kommentaren
  const handleSendComment = () => {
    if (comment.trim() !== "") {
      api
        .post(`post-interaction/${post.post_id}/comment`, { content: comment }) // Send kommentar til API'en
        .then((response) => {
          console.log("Comment sent:", response.data);
          setComment(""); // Nulstil kommentarteksten
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Nulstil textarea-højden
          }
          const newComment = {
            ...response.data,
            username: user.username,
            profile_picture: user.profilePicture,
          };
          setComments([...comments, newComment]); // Tilføj den nye kommentar til kommentarlisten
          setCommentsCount(parseInt(commentsCount) + 1); // Opdater antallet af kommentarer
          setShowComments(true); // Vis kommentarerne
        })
        .catch((error) => {
          console.error("Error sending comment:", error);
        });
    }
  };

  // Håndtering af tastetryk (Enter for at sende kommentaren)
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Undgå standardtastetryk for Enter
      handleSendComment(); // Afsend kommentaren
      setComment(""); // Nulstil kommentarteksten
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
          userId={user.userId}
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
