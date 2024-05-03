import styles from "./CreatePost.module.css"; // Import af CSS-moduler til styling
import { useAuth } from "../../../contexts/AuthContext"; // Import af hook til autentificering
import ProfilePicture from "../../ProfilePicture/ProfilePicture"; // Import af profilbilledkomponenten
import { useState } from "react"; // Import af useState hook fra React
import { IoCloseOutline } from "react-icons/io5"; // Import af ikon til lukning af opret post-modal
import api from "../../../utils/api"; // Import af API-funktionalitet
import { usePosts } from "../../../contexts/PostsContext"; // Import af hook til håndtering af opslag
import ImageSelection from "../../ImageSelection/ImageSelection"; // Import af komponent til billedvalg

const CreatePost = (props) => {
  // Brugerautentificeringsdata og håndtering af opslag fra kontekst
  const { user } = useAuth();
  const { addPost } = usePosts();

  // Tilstande for tekstindhold, valgt billede og forhåndsvisning af valgt billede
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

  // Funktion til håndtering af ændringer i tekstindholdet
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Funktion til håndtering af oprettelse af opslag
  const handleCreatePostClick = async () => {
    try {
      const formData = new FormData();
      formData.append("content", text);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Send POST-anmodning til API'en for at oprette opslag
      const response = await api.post("post-management/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Håndtering af API-respons
      if (response.status === 201) {
        console.log("Post created successfully!");
        setText(""); // Nulstil tekstindholdet
        setSelectedImage(null); // Nulstil valgt billede

        // Hent detaljerne for det nye opslag og tilføj det til opslagslisten
        await api
          .get(`post-management/posts/${response.data.post_id}`)
          .then((newPostDetailsResponse) => {
            addPost(newPostDetailsResponse.data);
          });
        props.closeModal(); // Luk opret post-modal
      } else {
        throw new Error("Post creation failed"); // Kast en fejl, hvis oprettelse mislykkes
      }
    } catch (error) {
      console.error("Error creating post:", error); // Håndtering af fejl under oprettelse af opslag
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
          {/* Vis brugerens profilbillede og navn */}
          <ProfilePicture
            src={user.profilePicture}
            style={{ marginRight: "0.5rem" }}
            userId={user.userId}
          />
          <p>{user.username}</p>
        </div>
        <div className={styles.userInputContainer}>
          {/* Tekstindtastningsfelt til opslagstekst */}
          <textarea
            className={styles.textarea}
            placeholder={`What's on your mind, ${user.username}?`}
            value={text}
            onChange={handleTextChange}
          ></textarea>
          {/* Komponent til valg af billede */}
          <ImageSelection
            image={selectedImage}
            setImage={setSelectedImage}
            imagePreview={selectedImagePreview}
            setImagePreview={setSelectedImagePreview}
          />
        </div>
        {/* Knappen til oprettelse af opslag */}
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
