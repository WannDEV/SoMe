import styles from "./FriendsList.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import { useFriends } from "@/contexts/FriendsContext";

const FriendItem = ({
  friend,
  friendshipStatuses,
  fetchFriendshipStatuses,
  removeFriend,
  addFriend,
  fetchFriends,
}) => {
  const [friendStatus, setFriendStatus] = useState(
    friendshipStatuses.find(
      (f) => f.user_id2 === friend.user_id || f.user_id1 === friend.user_id
    )?.status || null
  );

  useEffect(() => {
    setFriendStatus(
      friendshipStatuses.find(
        (f) => f.user_id2 === friend.user_id || f.user_id1 === friend.user_id
      )?.status || null
    );
  }, [friendshipStatuses]);

  const handleAddFriend = () => {
    api
      .post("friendship/friend-request", { friendId: friend.user_id })
      .then((response) => {
        console.log(response.data);
        fetchFriendshipStatuses();
        setFriendStatus("pending");
        addFriend(friend);
      });
  };

  const handleRemoveFriend = () => {
    api.delete(`friendship/friends/${friend.user_id}`).then((response) => {
      console.log(response.data);
      fetchFriendshipStatuses();
      setFriendStatus(null);
      removeFriend(friend.user_id);
    });
  };

  const handleAcceptFriend = () => {
    api
      .put("friendship/friend-request/accept", { friendId: friend.user_id })
      .then((response) => {
        console.log(response.data);
        fetchFriendshipStatuses();
        fetchFriends();
        setFriendStatus("accepted");
        addFriend(friend);
      });
  };

  const handleRejectFriend = () => {
    api
      .delete(`friendship/friend-request/reject/${friend.user_id}`)
      .then((response) => {
        console.log(response.data);
        fetchFriendshipStatuses();
        fetchFriends();
        setFriendStatus(null);
      });
  };

  return (
    <li className={styles.item}>
      <ProfilePicture src={friend.profile_picture} userId={friend.user_id} />
      <p className={styles.name}>{friend.username}</p>

      {friendshipStatuses.some(
        (f) => f.user_id1 === friend.user_id && friendStatus === "pending"
      ) && (
        <div>
          <button className={styles.acceptButton} onClick={handleAcceptFriend}>
            Accept
          </button>
          <button className={styles.declineButton} onClick={handleRejectFriend}>
            Decline
          </button>
        </div>
      )}
      {friendshipStatuses.some(
        (f) => f.user_id2 === friend.user_id && friendStatus === "pending"
      ) && <p className={styles.pending}>Pending</p>}

      {friendStatus === "accepted" && (
        <button className={styles.removeButton} onClick={handleRemoveFriend}>
          Remove
        </button>
      )}

      {!friendStatus &&
        !friendshipStatuses.some(
          (f) => f.user_id1 == friend.user_id || f.user_id2 == friend.user_id
        ) && (
          <button className={styles.addButton} onClick={handleAddFriend}>
            Add
          </button>
        )}
    </li>
  );
};

const FriendsList = ({ displayedFriends }) => {
  const {
    friendshipStatuses,
    fetchFriendshipStatuses,
    removeFriend,
    addFriend,
    fetchFriends,
  } = useFriends();

  return (
    <ul className={styles.friendsList}>
      {displayedFriends.map((friend, i) => (
        <FriendItem
          key={i}
          friend={friend}
          friendshipStatuses={friendshipStatuses}
          fetchFriendshipStatuses={fetchFriendshipStatuses}
          removeFriend={removeFriend}
          addFriend={addFriend}
          fetchFriends={fetchFriends}
        />
      ))}
    </ul>
  );
};

export default FriendsList;
