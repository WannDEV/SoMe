"use client";
import { WithAuth } from "@/components/Auth/WithAuth";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import FindFriends from "@/components/Friends/FindFriends/FindFriends";
import styles from "./page.module.css";
import { FriendsProvider } from "@/contexts/FriendsContext";

const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    api.get("friendship/friends/all").then((response) => {
      setFriends(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <FriendsProvider>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Friends</h1>
        <FindFriends />
      </div>
    </FriendsProvider>
  );
};

export default WithAuth(Friends);
