import styles from "./CreatePost.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import ProfilePicture from "../../ProfilePicture/ProfilePicture";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import api from "../../../utils/api";
import { usePosts } from "../../../contexts/PostsContext";
import ImageSelection from "../../ImageSelection/ImageSelection";

const CreatePost = (props) => {
  const { user } = useAuth();
  const { posts, addPost } = usePosts();
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
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
          <ImageSelection
            image={selectedImage}
            setImage={setSelectedImage}
            imagePreview={selectedImagePreview}
            setImagePreview={setSelectedImagePreview}
          />
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
