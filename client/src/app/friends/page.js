"use client";
import { WithAuth } from "@/components/Auth/WithAuth";
import FindFriends from "@/components/Friends/FindFriends/FindFriends";
import styles from "./page.module.css";
import { FriendsProvider } from "@/contexts/FriendsContext";
import AcceptedFriends from "@/components/Friends/AcceptedFriends/AcceptedFriends";
import FriendRequests from "@/components/Friends/FriendRequests/FriendRequests";

const Friends = () => {
  return (
    <FriendsProvider>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Friends</h1>
        <FindFriends />
        <AcceptedFriends />
        <FriendRequests />
      </div>
    </FriendsProvider>
  );
};

export default WithAuth(Friends);
