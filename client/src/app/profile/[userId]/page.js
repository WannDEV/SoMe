"use client"; // Importér klientmodulet

import { WithAuth } from "../../../components/Auth/WithAuth"; // Importér WithAuth-komponenten fra Auth-mappen
import { useParams } from "next/navigation"; // Importér useParams fra next/navigation for at få adgang til parametre fra URL'en
import styles from "./page.module.css"; // Importér CSS-stilarter fra den lokale fil "page.module.css"
import ProfilePicture from "../../../components/ProfilePicture/ProfilePicture"; // Importér ProfilePicture-komponenten fra ProfilePicture-mappen
import api from "../../../utils/api"; // Importér API-funktionalitet fra utils-mappen
import { useEffect, useState } from "react"; // Importér useEffect og useState hooks fra React
import { ImSad } from "react-icons/im"; // Importér Ikke-trist ikonet fra react-icons-biblioteket
import { formatTimestampToDate } from "../../../utils/formatTimestamp"; // Importér formatTimestampToDate-funktionen fra utils-mappen
import ChangeProfileImage from "../../../components/ChangeProfileImage/ChangeProfileImage"; // Importér ChangeProfileImage-komponenten fra ChangeProfileImage-mappen
import Posts from "../../../components/Posts/Posts"; // Importér Posts-komponenten fra Posts-mappen
import { PostsProvider } from "@/contexts/PostsContext"; // Importér PostsProvider fra PostsContext
import { useAuth } from "@/contexts/AuthContext"; // Importér useAuth-hooket fra AuthContext

// Deklarér en funktion med navnet Profile
const Profile = () => {
  const params = useParams(); // Hent parametre fra URL'en
  const { userId } = params; // Uddrag userId fra parametrene
  const [_user, _setUser] = useState(null); // Opret en state til brugerdata
  const { user } = useAuth(); // Brug useAuth-hooket til at få adgang til brugerens autentificeringsoplysninger
  const [loading, setLoading] = useState(true); // Opret en state til indikation af indlæsning
  const [modalOpen, setModalOpen] = useState(false); // Opret en state til at styre åbning/lukning af modalvinduet for redigering af profilbillede

  // Funktion til at åbne modalvinduet
  const openModal = () => {
    setModalOpen(true);
  };

  // Funktion til at lukke modalvinduet
  const closeModal = () => {
    setModalOpen(false);
  };

  // Effekt der henter brugerdata fra API'en baseret på userId
  useEffect(() => {
    setLoading(true); // Indikér at data er ved at blive hentet
    api
      .get(`user-profile/${userId}`) // Foretag et API-kald for at hente brugerens profildata baseret på userId
      .then((response) => {
        _setUser(response.data.user); // Opdater state med de hentede brugerdata
        setLoading(false); // Indikér at indlæsning er færdig
      })
      .catch((error) => {
        console.log(error); // Håndter fejl, hvis der opstår nogen under hentning af data
        setLoading(false); // Indikér at indlæsning er færdig
      });
  }, [userId]); // Kør effekten igen, hvis userId ændres

  // Hvis data indlæses, vises en indikator for indlæsning
  if (loading) {
    return <p>Loading...</p>;
  }

  // Hvis brugeren ikke blev fundet, vises en meddelelse om dette
  if (!_user) {
    return (
      <div className={styles.notFound}>
        <ImSad size={48} />
        <h1>User not found</h1>
      </div>
    );
  }

  // Hovedkomponenten der viser brugerprofilen, inklusiv profilbillede, brugernavn, tilmeldelsesdato og brugerens opslag
  return (
    <main className={styles.container}>
      <div>
        <div className={styles.profileInformation}>
          {/* Vis profilbillede, brugernavn og tilmeldelsesdato */}
          <ProfilePicture
            src={_user.profilePicture}
            customClass={styles.profilePicture}
            notClickable
          />
          <div>
            <h1>{_user.username}</h1>
            <p>Joined: {formatTimestampToDate(_user.registrationDate)}</p>
          </div>
          {/* Vis knap til redigering af profilbillede, kun hvis brugeren ser sin egen profil */}
          <button
            className={`${styles.editProfilePicture} ${
              user.userId != userId && styles.hideEditProfilePictureButton
            }`}
            onClick={openModal}
          >
            Edit Profile picture
          </button>
          {/* Vis redigeringsvindue til profilbillede hvis modalOpen er sand */}
          <ChangeProfileImage modalOpen={modalOpen} closeModal={closeModal} />
        </div>
      </div>
      <hr />
      <div className={styles.postsContainer}>
        {/* Leverer PostsProvider til Posts-komponenten og angiver postType og brugernavn */}
        <PostsProvider postType={"user"} username={_user.username}>
          {/* Viser brugerens opslag, skjuler opret opslag-knap hvis brugeren ser en anden brugers profil */}
          <Posts hideCreatePost={user.userId != userId} />
        </PostsProvider>
      </div>
    </main>
  );
};

// Eksportér Profile-komponenten med WithAuth-højere ordens komponenten, der kræver autentificering
export default WithAuth(Profile);
