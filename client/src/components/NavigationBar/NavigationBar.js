"use client";
import styles from "./NavigationBar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { IoMdNotifications } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import MenuBar from "../MenuBar/MenuBar";
import { useState } from "react";
import { BiSolidLogOut } from "react-icons/bi";
import { useRouter } from "next/navigation";

const NavigationBar = () => {
  const { user, logout, loading } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();

  if (loading || !user) {
    return null;
  }

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>
              <span>Be</span>Social
            </h1>
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/">Feed</Link>
          <Link href="/friends">Friends</Link>
        </div>
        <div className={styles.icons}>
          <Link href="#">
            <IoMdNotifications size={24} />
          </Link>
          <Link href="#">
            <AiFillMessage size={24} />
          </Link>
          <MenuBar
            triggerComponent={
              <button className={styles.profilePictureButton}>
                <ProfilePicture
                  src={user.profilePicture}
                  customClass={styles.profilePicture}
                />
              </button>
            }
            isOpen={isProfileMenuOpen}
            setIsOpen={setIsProfileMenuOpen}
            placement="right"
          >
            <ul className={styles.profileMenuList}>
              <li
                onClick={() => {
                  router.push(`/profile/${user.userId}`);
                  setIsProfileMenuOpen(false);
                }}
              >
                <ProfilePicture
                  src={user.profilePicture}
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
                <span>My Profile</span>
              </li>
              <li
                onClick={() => {
                  logout();
                  setIsProfileMenuOpen(false);
                }}
              >
                <BiSolidLogOut size={24} />
                <span>Logout</span>
              </li>
            </ul>
          </MenuBar>
        </div>
      </div>
      <div style={{ height: "var(--navbar-height)" }} />
    </>
  );
};

export default NavigationBar;
