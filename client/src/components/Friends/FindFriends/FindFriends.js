import styles from "./FindFriends.module.css"; // Importér CSS-stilarter fra den lokale fil "FindFriends.module.css"
import { FaSearch } from "react-icons/fa"; // Importér FaSearch-ikonet fra react-icons-biblioteket
import api from "../../../utils/api"; // Importér API-funktionalitet fra utils-mappen
import { useState, useCallback } from "react"; // Importér useState og useCallback-hooks fra React
import FriendsList from "../FriendsList/FriendsList"; // Importér FriendsList-komponenten fra FriendsList-modulet
import debounce from "lodash.debounce"; // Importér debounce-funktionen fra lodash
import { TbMoodEmpty } from "react-icons/tb"; // Importér TbMoodEmpty-ikonet fra react-icons-biblioteket

// Komponent til at søge efter venner
const FindFriends = () => {
  const [friends, setFriends] = useState([]); // State til at gemme venner
  const [searchQuery, setSearchQuery] = useState(""); // State til at gemme søgeforespørgslen

  // Funktion til håndtering af søgning, der bruger debounce til at forsinke søgningen
  const handleSearchChange = useCallback(
    debounce((e) => {
      // Sæt søgeinput fra inputfeltet
      setSearchQuery(e.target.value);

      if (!e.target.value) {
        setFriends([]); // Nulstil venner, hvis søgefeltet er tomt
        return;
      }

      // Udfør søgning efter venner baseret på søgeforespørgslen
      api
        .get(`friendship/friends/search/${e.target.value}`)
        .then((response) => {
          setFriends(response.data); // Opdater venneresultater baseret på API-svar
          console.log(response.data); // Udskriv venneresultater til konsollen
        });
    }, 300), // Vent 300 ms før søgning udføres
    []
  );

  return (
    <div className={styles.container}>
      {/* Container til FindFriends-komponenten */}
      <h3 className={styles.title}>Find Friends</h3>{" "}
      {/* Overskrift for at finde venner */}
      <div className={styles.searchbar}>
        {/* Søgebjælke til søgning efter venner */}
        <input
          type="text"
          placeholder="Search for people..."
          onChange={handleSearchChange} // Lyt efter ændringer i søgefeltet og udfør søgning
        />
        <FaSearch size={18} className={styles.searchIcon} /> {/* Søgeikon */}
      </div>
      <hr className={styles.line} />{" "}
      {/* Vandret linje adskiller søgebjælken fra søgeresultaterne */}
      {searchQuery && (
        <div className={styles.searchResults}>
          {/* Container til at vise søgeresultater */}
          <h4 className={styles.subtitle}>
            {/* Undertitel for søgeresultater */}
            <span>{friends.length}</span> result(s) found{" "}
            {/* Antal søgeresultater */}
          </h4>
          {friends.length === 0 && <TbMoodEmpty size={70} />}{" "}
          {/* Hvis ingen resultater, vis et tomt humørikon */}
          <FriendsList displayedFriends={friends} />{" "}
          {/* Vis søgeresultaterne i FriendsList */}
        </div>
      )}
      {!searchQuery && (
        <p className={styles.infoText}>
          {/* Info-tekst, hvis der ikke er nogen søgeforespørgsel */}
          Search results will be displayed here as you start typing.{" "}
          {/* Tekst om, at søgeresultater vil blive vist, når der skrives */}
        </p>
      )}
    </div>
  );
};

export default FindFriends; // Eksportér FindFriends-komponenten
