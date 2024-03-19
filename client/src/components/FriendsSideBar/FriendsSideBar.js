import styles from "./FriendsSideBar.module.css";
import AcceptedFriends from "./AcceptedFriends/AcceptedFriends";
import PendingFriends from "./PendingFriends/PendingFriends";
import api from "../../utils/api";
import { useEffect, useState } from "react";

const FriendsSideBar = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("friendship/friends/accepted");
        setAcceptedFriends(
          response.data.filter((friend) => friend.status === "accepted")
        );
        setPendingFriends(
          response.data.filter((friend) => friend.status === "pending")
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className={styles.container}>
      <div style={{ position: "fixed", width: "22.5rem" }}>
        <AcceptedFriends acceptedFriends={acceptedFriends} />
        <PendingFriends pendingFriends={pendingFriends} />
      </div>
    </div>
  );
};

export default FriendsSideBar;
