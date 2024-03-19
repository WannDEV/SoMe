"use client";
import { useState } from "react";
import styles from "./CreatePostCard.module.css";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { useAuth } from "../../../contexts/AuthContext";
import Modal from "../../Modal/Modal";
import CreatePost from "./CreatePost";

const CreatePostCard = (props) => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Create post</h3>
      <hr className={styles.line} />
      <div className={styles.innerContainer}>
        <ProfilePicture
          src={user.profilePicture}
          style={{ marginRight: "1rem" }}
        />
        <button className={styles.createPostButton} onClick={openModal}>
          {`What's on your mind, ${user.username}?`}
        </button>
      </div>
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <CreatePost closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default CreatePostCard;
