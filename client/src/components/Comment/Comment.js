import styles from "./Comment.module.css";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { formatTimestampToTimeAgo } from "../../utils/formatTimestamp";
import { IoIosMore } from "react-icons/io";
import MenuBar from "../Menu/MenuBar";

const Comment = (props) => {
  const comment = props.comment;

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
            buttonComponent={
              <button className={styles.moreButton}>
                <IoIosMore size={18} />
              </button>
            }
          >
            <ul>
              <li>Edit</li>
              <li>Delete</li>
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
