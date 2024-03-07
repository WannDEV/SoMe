import styles from "./CreatePost.module.css";
import { useAuth } from "../../contexts/AuthContext";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const CreatePost = (props) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePostClick = () => {
    console.log("Post created");
  };

  return (
    <div className={styles.container}>
      <span className={styles.headerBox}>
        <h3 className={styles.title}>Create post</h3>
        <button className={styles.closeButton} onClick={props.closeModal}>
          <IoCloseOutline />
        </button>
      </span>
      <hr className={styles.line} />
      <div className={styles.mainContent}>
        <div className={styles.profileContainer}>
          <ProfilePicture style={{ marginRight: "0.5rem" }} />
          <p>{user.username}</p>
        </div>
        <textarea
          className={styles.textarea}
          placeholder={`What's on your mind, ${user.username}?`}
          value={text}
          onChange={handleTextChange}
        ></textarea>
        {!selectedImage && (
          <div
            className={`${styles.dropZone} ${
              isDraggingOver ? styles.draggingOver : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <span>
              <FaCloudUploadAlt />
            </span>
            <p>Click here or drag and drop an image to upload</p>
          </div>
        )}
        {selectedImage && (
          <div className={styles.selectedImageContainer}>
            <img
              src={selectedImage}
              alt="Selected"
              className={styles.selectedImage}
            />
            <button
              className={styles.removeImageButton}
              onClick={() => setSelectedImage(null)}
            >
              <IoCloseOutline />
            </button>
          </div>
        )}
        <button
          className={styles.createPostButton}
          onClick={handleCreatePostClick}
          disabled={!selectedImage && text === ""}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
