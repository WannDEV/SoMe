import { useState, useRef } from "react"; // Importér useState og useRef-hooks fra React
import { FaCloudUploadAlt } from "react-icons/fa"; // Importér ikonkomponenten for upload-ikonet fra react-icons/fa
import { IoCloseOutline } from "react-icons/io5"; // Importér ikonkomponenten for lukke-ikonet fra react-icons/io5
import Image from "next/image"; // Importér Image-komponenten fra Next.js
import styles from "./ImageSelection.module.css"; // Importér CSS-stilarter fra den lokale fil "ImageSelection.module.css"

// Komponent til billedvalg
const ImageSelection = ({ image, setImage, imagePreview, setImagePreview }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false); // State til at spore, om brugeren trækker et billede over området
  const fileInputRef = useRef(null); // Ref til inputelement til filvalg

  // Funktion til håndtering af billedændring
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setImagePreview(reader.result); // Indstil billedet til forhåndsvisning
        setImage(selectedFile); // Indstil billedet
      };
    }
  };

  // Funktion til at håndtere trækover-effekten
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  // Funktion til at håndtere trækforlader-effekten
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  // Funktion til at håndtere slip-effekten
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Indstil billedet til forhåndsvisning
        setImage(file); // Indstil billedet
      };
      reader.readAsDataURL(file);
    }
  };

  // Funktion til at fjerne det valgte billede
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <>
      {!imagePreview && (
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
          <p className={styles.dropText}>
            Click here or drag and drop an image to upload
          </p>
        </div>
      )}
      {imagePreview && (
        <div className={styles.selectedImageContainer}>
          <Image
            src={imagePreview}
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
    </>
  );
};

export default ImageSelection; // Eksportér ImageSelection-komponenten
