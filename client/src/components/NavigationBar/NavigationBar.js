"use client";
import styles from "./NavigationBar.module.css"; // Importér CSS-stilarter fra den lokale fil "NavigationBar.module.css"
import { useAuth } from "../../contexts/AuthContext"; // Importér useAuth-hook fra AuthContext for at håndtere brugeroplysninger
import { IoMdNotifications } from "react-icons/io"; // Importér notifikationsikon fra react-icons/io
import { AiFillMessage } from "react-icons/ai"; // Importér beskedikon fra react-icons/ai
import Link from "next/link"; // Importér Link-komponenten fra Next.js for navigationslinker
import ProfilePicture from "../ProfilePicture/ProfilePicture"; // Importér ProfilePicture-komponenten til at vise brugerens profilbillede
import MenuBar from "../MenuBar/MenuBar"; // Importér MenuBar-komponenten til at vise en dropdown-menu
import { useState } from "react"; // Importér useState-hook fra React for at håndtere tilstand
import { BiSolidLogOut } from "react-icons/bi"; // Importér logudikon fra react-icons/bi
import { useRouter } from "next/navigation"; // Importér useRouter-hook fra Next.js for at få adgang til routerobjektet

// NavigationBar-komponenten
const NavigationBar = () => {
  const { user, logout, loading } = useAuth(); // Brug useAuth-hook til at hente brugeroplysninger og funktionen logout til at logge ud
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Tilstand til at styre åbning/lukning af profilmenuen
  const router = useRouter(); // Routerobjekt til navigation

  // Hvis der stadig indlæses eller der ikke er nogen bruger, returneres intet
  if (loading || !user) {
    return null;
  }

  // Returnerer navigationslinjen og menuen
  return (
    <>
      {/* Navigationslinjen */}
      <div className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <h1>
              <span>Be</span>Social
            </h1>
          </Link>
        </div>
        {/* Links */}
        <div className={styles.links}>
          <Link href="/">Feed</Link>
          <Link href="/friends">Friends</Link>
        </div>
        {/* Ikoner */}
        <div className={styles.icons}>
          <Link href="#">
            <IoMdNotifications size={24} />
          </Link>
          <Link href="#">
            <AiFillMessage size={24} />
          </Link>
          {/* Profilmenu */}
          <MenuBar
            triggerComponent={
              // Udløserkomponenten, her et knap med brugerens profilbillede
              <button className={styles.profilePictureButton}>
                <ProfilePicture
                  src={user.profilePicture} // Brugerens profilbillede
                  customClass={styles.profilePicture} // CSS-klasse til brugerens profilbillede
                  notClickable // Angiver, at billedet ikke er klikbart
                />
              </button>
            }
            isOpen={isProfileMenuOpen} // Angiver om menuen er åben eller lukket
            setIsOpen={setIsProfileMenuOpen} // Funktion til at indstille om menuen er åben eller lukket
            placement="right" // Placering af menuen
          >
            {/* Indholdet af profilmenuen */}
            <ul className={styles.profileMenuList}>
              {/* Link til brugerens profil */}
              <li
                onClick={() => {
                  router.push(`/profile/${user.userId}`); // Navigerer til brugerens profilside
                  setIsProfileMenuOpen(false); // Lukker profilmenuen
                }}
              >
                <ProfilePicture
                  src={user.profilePicture} // Brugerens profilbillede
                  style={{ width: "1.5rem", height: "1.5rem" }} // Stil til profilbilledet
                  customClass={styles.profilePicture} // CSS-klasse til brugerens profilbillede
                  notClickable // Angiver, at billedet ikke er klikbart
                />
                <span>My Profile</span> {/* Tekst til linket */}
              </li>
              {/* Logud-link */}
              <li
                onClick={() => {
                  logout(); // Logger brugeren ud
                  setIsProfileMenuOpen(false); // Lukker profilmenuen
                }}
              >
                <BiSolidLogOut size={24} /> {/* Logudikon */}
                <span>Logout</span> {/* Tekst til linket */}
              </li>
            </ul>
          </MenuBar>
        </div>
      </div>
      {/* Ekstra højde til at sikre korrekt placering af indholdet under navigationslinjen */}
      <div style={{ height: "var(--navbar-height)" }} />
    </>
  );
};

export default NavigationBar; // Eksportér NavigationBar-komponenten
