import { useState, useRef } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import styles from "./ImageSelection.module.css";

const ImageSelection = ({ image, setImage, imagePreview, setImagePreview }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile); // For preview (optional)
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update state with the data URL
        setImage(selectedFile); // Update state with the Blob object
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
        setImagePreview(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <p>Click here or drag and drop an image to upload</p>
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

export default ImageSelection;
