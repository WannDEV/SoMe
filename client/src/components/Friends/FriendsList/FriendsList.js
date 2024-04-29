import styles from "./FriendsList.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import api from "@/utils/api";
import { useState } from "react";

const FriendsList = ({ displayedFriends }) => {

  const handleAddFriend = (friend) => {
    api.post("friendship/friend-request", { friendId: friend.user_id }).then((response) => {
      console.log(response.data);
    });
  }

  const handleRemoveFriend = (friend) => {
    api.delete(`friendship/friends/${friend.user_id}`).then((response) => {
      console.log(response.data);
    });
  }

  const handleAcceptFriend = (friend) => {
    api.put("friendship/friend-request/accept", { friendId: friend.user_id }).then((response) => {
      console.log(response.data);
    });
  }

  const handleRejectFriend = (friend) => {
    api.delete("friendship/friend-request/reject", { friendId: friend.user_id }).then((response) => {
      console.log(response.data);
    });
  }

  return (
    <ul className={styles.friendsList}>
      {displayedFriends.map((friend, i) => {
        const [friendStatus, setFriendStatus] = useState(friend.status);

        return (
        <li className={styles.item} key={i}>
          <ProfilePicture src={friend.profile_picture} />
          <p className={styles.name}>{friend.username}</p>
          {friendStatus === "pending" && (
            <div>
              <button className={styles.acceptButton} onClick={() => {
                handleAcceptFriend(friend);
                setFriendStatus("accepted");
              }}>Accept</button>
              <button className={styles.declineButton} onClick={() => {
                handleRejectFriend(friend);
                setFriendStatus(null);
              }}>Decline</button>
            </div>
          )}
          {friendStatus === "accepted" && (<button className={styles.removeButton} onClick={() => {
            handleRemoveFriend(friend);
            setFriendStatus(null);
          }}>Remove</button>)}
          {!friendStatus && <button className={styles.addButton} onClick={() => {
            handleAddFriend(friend)
            setFriendStatus("pending");
          }}>Add</button>}
        </li>
)})}
    </ul>
  );
};

export default FriendsList;
