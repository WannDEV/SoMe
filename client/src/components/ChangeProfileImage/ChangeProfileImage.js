"use client"; // Importér klientmodulet

import { useState } from "react"; // Importér useState-hooket fra React
import styles from "./ChangeProfileImage.module.css"; // Importér CSS-stilarter fra den lokale fil "ChangeProfileImage.module.css"
import Modal from "../Modal/Modal"; // Importér Modal-komponenten fra Modal-modulet
import ImageSelection from "../ImageSelection/ImageSelection"; // Importér ImageSelection-komponenten fra ImageSelection-modulet
import { IoCloseOutline } from "react-icons/io5"; // Importér IoCloseOutline-ikonet fra react-icons-biblioteket
import api from "../../utils/api"; // Importér API-funktionalitet fra utils-mappen

// Funktion til ændring af profilbillede
const ChangeProfileImage = ({ modalOpen, closeModal }) => {
  const [profileImage, setProfileImage] = useState(null); // Opret en state til det valgte profilbillede
  const [profileImagePreview, setProfileImagePreview] = useState(null); // Opret en state til forhåndsvisning af profilbillede

  // Funktion til håndtering af gem-knap
  const handleSave = () => {
    const formData = new FormData(); // Opret et FormData-objekt til at sende billeddataen

    formData.append("image", profileImage); // Tilføj det valgte billede til FormData-objektet

    // Foretag en PUT-anmodning til API'en for at opdatere profilbilledet
    api.put("user-profile/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Indstil headeren til multipart/form-data
    });
    closeModal(); // Luk modalen efter gemning af billedet

    // Nulstil valgt billede og dets forhåndsvisning
    setProfileImage(null);
    setProfileImagePreview(null);

    window.location.reload(); // Genindlæs siden for at opdatere brugergrænsefladen
  };

  return (
    <Modal isOpen={modalOpen} onClose={closeModal}>
      {/* Modal til visning af ændringsmuligheder for profilbillede */}
      <div className={styles.changeImageContainer}>
        {/* Container til ændring af profilbillede */}
        <h3>Change Profile Picture</h3>
        {/* Overskrift for ændring af profilbillede */}
        <button className={styles.closeButton} onClick={closeModal}>
          {/* Luk-knap til modalen */}
          <IoCloseOutline /> {/* Ikon for luk-knap */}
        </button>
        <ImageSelection
          image={profileImage}
          setImage={setProfileImage}
          imagePreview={profileImagePreview}
          setImagePreview={setProfileImagePreview}
        />
        {/* Komponent til valg af profilbillede */}
        <button
          className={styles.saveButton}
          disabled={!profileImage} // Deaktiver gem-knap hvis der ikke er valgt noget billede
          onClick={handleSave} // Kald handleSave-funktionen ved klik på gem-knap
        >
          Save {/* Tekst for gem-knap */}
        </button>
      </div>
    </Modal>
  );
};

export default ChangeProfileImage; // Eksportér ChangeProfileImage-komponenten
