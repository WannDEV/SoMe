import styles from "./FriendRequests.module.css";
import FriendsList from "../FriendsList/FriendsList";
import { useFriends } from "@/contexts/FriendsContext";

const FriendRequests = () => {
  const { friends } = useFriends();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friend Requests</h2>
      <hr className={styles.line} />
      <FriendsList
        displayedFriends={friends.filter(
          (friend) => friend.status === "pending"
        )}
      />
      {friends.filter((friend) => friend.status === "pending").length === 0 && (
        <p className={styles.infoText}>No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;
