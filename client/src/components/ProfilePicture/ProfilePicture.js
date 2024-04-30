"use client";
import styles from "./ProfilePicture.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfilePicture = (props) => {
  const { push } = useRouter();

  return (
    <Image
      src={props.src || "/monkey.jpg"}
      alt="Profile"
      className={`${styles.profilePic} ${props.customClass}`}
      style={props.style}
      width={24}
      height={24}
      onClick={() => {
        console.log("notClickable:", props.notClickable);
        if (!props.notClickable) push(`/profile/${props.userId}`);
      }}
    />
  );
};

export default ProfilePicture;
