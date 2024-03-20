import styles from './FriendsList.module.css';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { formatTimestampToTimeAgo } from '../../utils/formatTimestampToTimeAgo';

const FriendsList = ({ friends }) => {
    return (
        <ul className={styles.friendsList}>
        {friends.map(friend => (
        <li className={styles.item}>
            <ProfilePicture src={friend.profile_picture} />
            <p className={styles.name}>{friend.username}</p>
            <span className={styles.status}>{formatTimestampToTimeAgo(friend.lastActiveAt)}</span>
        </li>
        ))}
        </ul>
    );
    };

export default FriendsList;