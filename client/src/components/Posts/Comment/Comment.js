import styles from "./Comment.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { formatTimestampToTimeAgo } from "../../../utils/formatTimestamp";
import { IoIosMore } from "react-icons/io";
import MenuBar from "../../MenuBar/MenuBar";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import api from "../../../utils/api";

const Comment = (props) => {
  const comment = props.comment;
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    api
      .delete(`post-interaction/${props.postId}/comment/${comment.comment_id}`)
      .then((response) => {
        console.log("Comment deleted");
        setIsOpen(false);
        props.setComments(
          props.comments.filter((c) => c.comment_id !== comment.comment_id)
        );
        props.setCommentsCount(props.commentsCount - 1);
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
        // Handle any error that occurs during deletion
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <ProfilePicture src={comment.profile_picture} />
      </div>
      <div>
        <div className={styles.commentContainer}>
          <div className={styles.bubble}>
            <p className={styles.username}>{comment.username}</p>
            <p className={styles.content}>{comment.content}</p>
          </div>
          <MenuBar
            triggerComponent={
              <button
                className={`${styles.moreButton} ${
                  isOpen ? styles.menuIsOpen : ""
                }`}
              >
                <IoIosMore size={18} />
              </button>
            }
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            placement="left"
          >
            <ul>
              <li onClick={handleDelete} className={styles.deleteComment}>
                <MdDelete size={24} />
                Delete comment
              </li>
            </ul>
          </MenuBar>
        </div>
        <p className={styles.date}>
          {formatTimestampToTimeAgo(comment.comment_date)}
        </p>
      </div>
    </div>
  );
};

export default Comment;
