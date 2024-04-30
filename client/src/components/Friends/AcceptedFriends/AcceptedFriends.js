import styles from "./AcceptedFriends.module.css";
import { useFriends } from "@/contexts/FriendsContext";
import FriendsList from "../FriendsList/FriendsList";

const AcceptedFriends = () => {
  const { friends } = useFriends();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friends</h2>
      <hr className={styles.line} />
      <FriendsList
        displayedFriends={friends.filter(
          (friend) => friend.status === "accepted"
        )}
      />
      {friends.length === 0 && (
        <p className={styles.infoText}>No friends yet</p>
      )}
    </div>
  );
};

export default AcceptedFriends;
