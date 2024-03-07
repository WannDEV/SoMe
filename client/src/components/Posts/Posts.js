import styles from './Posts.module.css';
import PostCard from '../PostCard/PostCard';

const Posts = () => {
    return (
            <div className={styles.container}>
                <PostCard />
            </div>
    );
};

export default Posts;