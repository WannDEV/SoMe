import { useState, useRef } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import styles from "./PostCard.module.css";
import Comment from "../Comment/Comment";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoSend } from "react-icons/io5";

const DUMMY_TEXT =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequunturvoluptatum laborum numquam blanditiis harum quisquam eius sed oditfugiat iusto fuga praesentium optio, eaque rerum! Provident similiqueaccusantium nemo autem. Veritatis obcaecati tenetur iure eius earum utmolestias architecto voluptate aliquam nihil, eveniet aliquid culpaofficia aut! Impedit sit sunt quaerat, odit, tenetur error, harumnesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam";

const PostCard = () => {
  const [liked, setLiked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [comment, setComment] = useState("");
  const textareaRef = useRef(null);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSendComment = () => {
    // Add your logic to send the comment
    console.log("Comment sent:", comment);
    // Clear the input field after sending the comment
    setComment("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default Enter key behavior
      // Here you can submit the comment or perform any action
      console.log("Submit comment:", comment);
      setComment("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <ProfilePicture style={{ marginRight: "0.5rem" }} />
        <div>
          <h4>Username</h4>
          <p>25. November 2023 at 09.12 PM</p>
        </div>
      </div>
      <div className={styles.content}>
        <p>
          {showMore ? DUMMY_TEXT : `${DUMMY_TEXT.substring(0, 300)}... `}
          <span onClick={() => setShowMore(true)} className={styles.showMore}>
            {!showMore && "Show more"}
          </span>
        </p>
        <div className={styles.imageContainer}>
          {/* <img src="/sample.jpg" /> */}
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
            <p>6.2k</p>
          </button>
          <button>
            <FaRegCommentDots size={24} /> <p>200</p>
          </button>
        </span>
        <button>
          <CiShare2 size={24} /> <p>18</p>
        </button>
      </div>
      <hr />
      <Comment />
      <button className={styles.seeAllButton}>
        <p>View all comments</p>
        <IoIosArrowDown />
      </button>
      <div className={styles.commentContainer}>
        <ProfilePicture style={{ marginRight: "0.5rem" }} />
        <div className={styles.commentInputContainer}>
          <textarea
            placeholder="Write a comment..."
            className={styles.commentInput}
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

export default PostCard;
