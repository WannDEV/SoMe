"use client"; // Importér klientmodulet

import { WithAuth } from "@/components/Auth/WithAuth"; // Importér WithAuth-komponenten fra auth-mappen
import FindFriends from "@/components/Friends/FindFriends/FindFriends"; // Importér FindFriends-komponenten fra Friends-mappen
import styles from "./page.module.css"; // Importér CSS-stilarter fra den lokale fil "page.module.css"
import { FriendsProvider } from "@/contexts/FriendsContext"; // Importér FriendsProvider fra FriendsContext
import AcceptedFriends from "@/components/Friends/AcceptedFriends/AcceptedFriends"; // Importér AcceptedFriends-komponenten fra Friends-mappen
import FriendRequests from "@/components/Friends/FriendRequests/FriendRequests"; // Importér FriendRequests-komponenten fra Friends-mappen

// Deklarér en funktion med navnet Friends
const Friends = () => {
  return (
    // Wrap alle vennerelaterede komponenter i FriendsProvider for at give dem adgang til FriendsContext
    <FriendsProvider>
      <div className={styles.container}>
        {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" */}
        <h1 className={styles.title}>Manage Friends</h1>{" "}
        {/* Opret en overskrift med klasse baseret på CSS-stilarter fra "page.module.css" */}
        <FindFriends /> {/* Indsæt FindFriends-komponenten */}
        <AcceptedFriends /> {/* Indsæt AcceptedFriends-komponenten */}
        <FriendRequests /> {/* Indsæt FriendRequests-komponenten */}
      </div>
    </FriendsProvider>
  );
};

// Eksportér Friends-komponenten med WithAuth-højere ordens komponent, der giver adgang til autentificeringsegenskaber
export default WithAuth(Friends);
