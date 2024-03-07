import styles from './Comment.module.css';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const Comment = () => {
    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <ProfilePicture />
                <p>Username</p>
                <p>4 hours ago</p>
            </div>
            <div className={styles.content}>
                <p>Comment content</p>
            </div>
        </div>
    );
}

export default Comment;