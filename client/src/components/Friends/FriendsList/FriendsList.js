import styles from "./FriendsList.module.css"; // Importér CSS-stilarter fra den lokale fil "FriendsList.module.css"
import ProfilePicture from "../../ProfilePicture/ProfilePicture"; // Importér ProfilePicture-komponenten fra ProfilePicture-modulet
import api from "@/utils/api"; // Importér API-funktionalitet fra utils-mappen
import { useState, useEffect } from "react"; // Importér useState og useEffect-hooks fra React
import { useFriends } from "@/contexts/FriendsContext"; // Importér brug af FriendsContext

// Komponent til at vise et enkelt vennepunkt
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
  ); // State til at gemme venskabsstatus og opdatere det i komponenten

  // Effekt til at opdatere venskabsstatus, når der sker ændringer
  useEffect(() => {
    setFriendStatus(
      friendshipStatuses.find(
        (f) => f.user_id2 === friend.user_id || f.user_id1 === friend.user_id
      )?.status || null
    );
  }, [friendshipStatuses]);

  // Funktion til at tilføje en venneanmodning
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

  // Funktion til at fjerne en ven
  const handleRemoveFriend = () => {
    api.delete(`friendship/friends/${friend.user_id}`).then((response) => {
      console.log(response.data);
      fetchFriendshipStatuses();
      setFriendStatus(null);
      removeFriend(friend.user_id);
    });
  };

  // Funktion til at acceptere en venneanmodning
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

  // Funktion til at afvise en venneanmodning
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
      {" "}
      {/* Element til at repræsentere et vennepunkt */}
      <ProfilePicture
        src={friend.profile_picture}
        userId={friend.user_id}
      />{" "}
      {/* Vis profilbillede af ven */}
      <p className={styles.name}>{friend.username}</p>{" "}
      {/* Vis brugernavnet på ven */}
      {friendshipStatuses.some(
        (f) => f.user_id1 === friend.user_id && friendStatus === "pending"
      ) && (
        <div>
          {" "}
          {/* Vis knapper til accept og afvisning, hvis venneanmodningen er udestående */}
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
      ) && <p className={styles.pending}>Pending</p>}{" "}
      {/* Vis "Pending", hvis venneanmodningen er udestående */}
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

// Komponent til at vise venner
const FriendsList = ({ displayedFriends }) => {
  const {
    friendshipStatuses,
    fetchFriendshipStatuses,
    removeFriend,
    addFriend,
    fetchFriends,
  } = useFriends(); // Brug useFriends-hooket til at få adgang til venneoplysninger og funktioner

  return (
    <ul className={styles.friendsList}>
      {" "}
      {/* Liste til at vise venner */}
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

export default FriendsList; // Eksportér FriendsList-komponenten
