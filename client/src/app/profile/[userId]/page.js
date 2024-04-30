"use client";
import { WithAuth } from "../../../components/Auth/WithAuth";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture";
import api from "../../../utils/api";
import { useEffect, useState } from "react";
import { ImSad } from "react-icons/im";
import { formatTimestampToDate } from "../../../utils/formatTimestamp";
import ChangeProfileImage from "../../../components/ChangeProfileImage/ChangeProfileImage";
import Posts from "../../../components/Posts/Posts";
import { PostsProvider } from "@/contexts/PostsContext";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const params = useParams();
  const { userId } = params;
  const [_user, _setUser] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`user-profile/${userId}`)
      .then((response) => {
        _setUser(response.data.user);
        console.log(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!_user) {
    return (
      <div className={styles.notFound}>
        <ImSad size={48} />
        <h1>User not found</h1>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div>
        <div className={styles.profileInformation}>
          <ProfilePicture
            src={_user.profilePicture}
            customClass={styles.profilePicture}
            notClickable
          />
          <div>
            <h1>{_user.username}</h1>
            <p>Joined: {formatTimestampToDate(_user.registrationDate)}</p>
          </div>
          <button
            className={`${styles.editProfilePicture} ${
              user.userId != userId && styles.hideEditProfilePictureButton
            }`}
            onClick={openModal}
          >
            Edit Profile picture
          </button>
          <ChangeProfileImage modalOpen={modalOpen} closeModal={closeModal} />
        </div>
      </div>
      <hr />
      <div className={styles.postsContainer}>
        <PostsProvider postType={"user"} username={_user.username}>
          <Posts hideCreatePost={user.userId != userId} />
        </PostsProvider>
      </div>
    </main>
  );
};

export default WithAuth(Profile);
