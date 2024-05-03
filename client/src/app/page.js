"use client"; // Importér klientmodulet

import styles from "./page.module.css"; // Importér CSS-stilarter fra den lokale fil "page.module.css"
import { WithAuth } from "../components/Auth/WithAuth"; // Importér WithAuth-komponenten fra Auth-mappen
import Posts from "../components/Posts/Posts"; // Importér Posts-komponenten fra Posts-mappen
import { PostsProvider } from "../contexts/PostsContext"; // Importér PostsProvider fra PostsContext
import { useState } from "react"; // Importér useState-hooket fra React

// Deklarér en funktion med navnet Home
const Home = () => {
  const [feedType, setFeedType] = useState("discover"); // Opret en state til at styre hvilken feedtype der vises

  return (
    <main>
      <div className={styles.container}>
        {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for container */}
        <div className={styles.feedTypeButtons}>
          {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for feedtypeknapper */}
          {/* Knappen til at skifte til opdagelsesfeedet */}
          <button
            onClick={() => setFeedType("discover")} // Lyt efter klik og opdater feedtypen til "discover"
            className={`${styles.feedTypeButton} ${
              // Anvend feedTypeButton-klassen og feedTypeButtonActive-klassen hvis feedType er "discover"
              feedType === "discover" ? styles.feedTypeButtonActive : ""
            }`}
          >
            Discover
          </button>
          {/* Knappen til at skifte til venners feedet */}
          <button
            onClick={() => setFeedType("friends")} // Lyt efter klik og opdater feedtypen til "friends"
            className={`${styles.feedTypeButton} ${
              // Anvend feedTypeButton-klassen og feedTypeButtonActive-klassen hvis feedType er "friends"
              feedType === "friends" ? styles.feedTypeButtonActive : ""
            }`}
          >
            Friends
          </button>
        </div>
        {/* Leverer PostsProvider til Posts-komponenten med feedtypen som postType */}
        <PostsProvider postType={feedType}>
          <Posts /> {/* Viser opslag baseret på feedtypen */}
        </PostsProvider>
      </div>
    </main>
  );
};

// Eksportér Home-komponenten med WithAuth-højere ordens komponenten, der kræver autentificering
export default WithAuth(Home);
