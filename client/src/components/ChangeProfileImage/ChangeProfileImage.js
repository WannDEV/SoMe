"use client";
import { useState } from "react";
import styles from "./ChangeProfileImage.module.css";
import Modal from "../Modal/Modal";
import ImageSelection from "../ImageSelection/ImageSelection";
import { IoCloseOutline } from "react-icons/io5";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const ChangeProfileImage = ({ modalOpen, closeModal }) => {
  const { user, setUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleSave = () => {
    // Update the user's profile picture
    const formData = new FormData();
    formData.append("image", profileImage);

    api.put("user-profile/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Close the modal
    closeModal();

    // Reset the image selection
    setProfileImage(null);
    setProfileImagePreview(null);

    window.location.reload();
  };

  return (
    <Modal isOpen={modalOpen} onClose={closeModal}>
      <div className={styles.changeImageContainer}>
        <h3>Change Profile Picture</h3>
        <button className={styles.closeButton} onClick={closeModal}>
          <IoCloseOutline />
        </button>
        <ImageSelection
          image={profileImage}
          setImage={setProfileImage}
          imagePreview={profileImagePreview}
          setImagePreview={setProfileImagePreview}
        />
        <button
          className={styles.saveButton}
          disabled={!profileImage}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ChangeProfileImage;
