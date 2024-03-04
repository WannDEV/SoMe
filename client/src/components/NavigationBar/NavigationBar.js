"use client";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../contexts/AuthContext";

const NavigationBar = () => {
  const { user, logout, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>Your Website Logo</div>
      <div className={styles.searchbar}>
        <input type="text" placeholder="Search..." />
      </div>
      <div className={styles.icons}>
        <img src="/icons/notification_icon.png" alt="Notifications" />
        <img src="/icons/message_icon.png" alt="Messages" />
        <img
          src="/user/profile_picture.jpg"
          alt="Profile"
          className={styles.profilePic}
        />
      </div>
    </div>
  );
};

export default NavigationBar;
