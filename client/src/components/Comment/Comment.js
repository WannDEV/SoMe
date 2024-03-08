import styles from "./Comment.module.css";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Comment = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <ProfilePicture />
      </div>
      <div>
        <div className={styles.bubble}>
          <p className={styles.username}>Username</p>
          <p className={styles.content}>Comment content</p>
        </div>
        <p className={styles.date}>4 hours ago</p>
      </div>
    </div>
  );
};

export default Comment;
