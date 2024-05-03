"use client";
import { useState } from "react"; // Import af useState hook fra React
import styles from "./CreatePostCard.module.css"; // Import af CSS-moduler til styling
import ProfilePicture from "../../ProfilePicture/ProfilePicture"; // Import af profilbilledkomponenten
import { useAuth } from "../../../contexts/AuthContext"; // Import af hook til brugerautentificering
import Modal from "../../Modal/Modal"; // Import af modal-komponenten
import CreatePost from "./CreatePost"; // Import af komponent til oprettelse af opslag

const CreatePostCard = (props) => {
  // Brugerautentificeringsdata fra kontekst og tilstand for modalens åbenhed
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Funktion til at åbne modalen
  const openModal = () => {
    setModalOpen(true);
  };

  // Funktion til at lukke modalen
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={`${styles.container} ${props.hide && styles.hide}`}>
      {/* Overskrift til opret post-sektionen */}
      <h3 className={styles.title}>Create post</h3>
      <hr className={styles.line} />
      <div className={styles.innerContainer}>
        {/* Vis brugerens profilbillede og knap til at åbne modalen */}
        <ProfilePicture
          src={user.profilePicture}
          style={{ marginRight: "1rem" }}
          userId={user.userId}
        />
        <button className={styles.createPostButton} onClick={openModal}>
          {`What's on your mind, ${user.username}?`}
        </button>
      </div>
      {/* Modal til oprettelse af opslag */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <CreatePost closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default CreatePostCard;
