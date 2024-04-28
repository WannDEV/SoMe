import styles from "./FriendsList.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { useFriends } from "@/contexts/FriendsContext";

const FriendsList = ({ displayedFriends }) => {
  const { friends, loading } = useFriends();

  if (loading) {
    return;
  }

  return (
    <ul className={styles.friendsList}>
      {displayedFriends.map((friend, i) => (
        <li className={styles.item} key={i}>
          <ProfilePicture src={friend.profile_picture} />
          <p className={styles.name}>{friend.username}</p>
          {friends.some((f) => f.friend_id === friend.id) ? (
            <button className={styles.removeButton}>Remove</button>
          ) : (
            <button className={styles.addButton}>Add</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FriendsList;
