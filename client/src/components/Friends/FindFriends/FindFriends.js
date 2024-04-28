import styles from "./FindFriends.module.css";
import { FaSearch } from "react-icons/fa";
import api from "../../../utils/api";
import { useState, useCallback } from "react";
import FriendsList from "../FriendsList/FriendsList";
import debounce from "lodash.debounce";
import { TbMoodEmpty } from "react-icons/tb";

const FindFriends = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback(
    debounce((e) => {
      // Sæt søgeinput fra inputfeltet
      setSearchQuery(e.target.value);

      if (!e.target.value) {
        setFriends([]);
        return;
      }

      api
        .get(`friendship/friends/search/${e.target.value}`)
        .then((response) => {
          setFriends(response.data);
          console.log(response.data);
        });
    }, 300),
    []
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Find Friends</h3>
      <div className={styles.searchbar}>
        <input
          type="text"
          placeholder="Search for people..."
          onChange={handleSearchChange}
        />
        <FaSearch size={18} className={styles.searchIcon} />
      </div>
      <hr className={styles.line} />
      {searchQuery && (
        <div className={styles.searchResults}>
          <h4 className={styles.subtitle}>
            <span>{friends.length}</span> results found
          </h4>
          {friends.length === 0 && <TbMoodEmpty size={70} />}
          <FriendsList displayedFriends={friends} />
        </div>
      )}
      {!searchQuery && (
        <p className={styles.infoText}>
          Friends will be displayed here as you start typing.
        </p>
      )}
    </div>
  );
};

export default FindFriends;
