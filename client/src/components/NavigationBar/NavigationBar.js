"use client";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";

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
        <Link href="#">
          <IoMdNotifications size={24} />
        </Link>
        <Link href="#">
          <AiFillMessage size={24} />
        </Link>
        <Image
          src="/monkey.jpg"
          alt="Profile"
          className={styles.profilePic}
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};

export default NavigationBar;
