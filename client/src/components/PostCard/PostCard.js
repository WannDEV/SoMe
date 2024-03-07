import ProfilePicture from '../ProfilePicture/ProfilePicture';
import styles from './PostCard.module.css';
import Comment from '../Comment/Comment';

const PostCard = () => {

    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <ProfilePicture />
                <p>Username</p>
                <p>4 hours ago</p>
            </div>
            <div className={styles.content}>
                <p>Post content</p>
                <img src="/monkey.jpg" />
            </div>
            <div className={styles.actionButtons}>
                <button>Like 6.2k</button>
                <button>Comment 200</button>
                <button>Share 18</button>
            </div>
            <hr />
            <Comment />
            <button>See all</button>
            <input type="text" placeholder="Write a comment..." />
        </div>
    );
};

export default PostCard;