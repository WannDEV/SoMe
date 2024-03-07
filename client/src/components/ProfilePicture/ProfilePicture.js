"use client";
import styles from "./ProfilePicture.module.css";
import Image from "next/image";

const ProfilePicture = (props) => {
  return (
    <Image
      src={props.src || "/monkey.jpg"}
      alt="Profile"
      className={`${styles.profilePic} ${props.customClass}`}
      style={props.style}
      width={24}
      height={24}
    />
  );
};

export default ProfilePicture;
