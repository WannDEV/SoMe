import styles from "./CreatePost.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import api from "../../../utils/api";
import Image from "next/image";
import { usePosts } from "../../../contexts/PostsContext";

const CreatePost = (props) => {
  const { user } = useAuth();
  const { posts, addPost } = usePosts();
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile); // For preview (optional)
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result); // Update state with the data URL
        setSelectedImage(selectedFile); // Update state with the Blob object
      };
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
        setSelectedImagePreview(reader.result);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImagePreview(null);
  };

  const handleCreatePostClick = async () => {
    try {
      const formData = new FormData();
      formData.append("content", text);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Send a POST request with the form data
      const response = await api.post("post-management/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful response
      if (response.status === 201) {
        console.log("Post created successfully!");
        // Display a success message to the user
        // Reset form fields
        setText("");
        setSelectedImage(null);

        await api
          .get(`post-management/posts/${response.data.post_id}`)
          .then((newPostDetailsResponse) => {
            addPost(newPostDetailsResponse.data);
          });
        props.closeModal(); // Close the modal if applicable
      } else {
        throw new Error("Post creation failed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Display an error message to the user
    }
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
          <ProfilePicture
            src={user.profilePicture}
            style={{ marginRight: "0.5rem" }}
          />
          <p>{user.username}</p>
        </div>
        <div className={styles.userInputContainer}>
          <textarea
            className={styles.textarea}
            placeholder={`What's on your mind, ${user.username}?`}
            value={text}
            onChange={handleTextChange}
          ></textarea>
          {!selectedImagePreview && (
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
          {selectedImagePreview && (
            <div className={styles.selectedImageContainer}>
              <Image
                src={selectedImagePreview}
                alt="Selected"
                className={styles.selectedImage}
                layout="responsive"
                width={500}
                height={300}
              />
              <button
                className={styles.removeImageButton}
                onClick={handleRemoveImage}
              >
                <IoCloseOutline />
              </button>
            </div>
          )}
        </div>
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
