"use client";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { IoMdNotifications } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const NavigationBar = () => {
  const { user, logout, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <h1>
            <span>Be</span>Social
          </h1>
        </Link>
      </div>
      <div className={styles.searchbar}>
        <input type="text" placeholder="Search for people, groups etc..." />
        <FaSearch size={18} className={styles.searchIcon} />
      </div>
      <div className={styles.icons}>
        <Link href="#">
          <IoMdNotifications size={24} />
        </Link>
        <Link href="#">
          <AiFillMessage size={24} />
        </Link>
        <ProfilePicture src={user.profilePicture} />
      </div>
    </div>
  );
};

export default NavigationBar;
