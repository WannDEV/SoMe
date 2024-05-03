import React, { createContext, useContext, useState, useEffect } from "react"; // Import af hooks og createContext fra React
import api from "../utils/api"; // Import af API-funktionalitet

// Oprettelse af kontekst til vennerelationer
const FriendsContext = createContext();

// Vennerelationsudbyderkomponent
export const FriendsProvider = ({ children }) => {
  // Tilstande til venner, indlæsningsstatus og venskabsstatusser
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendshipStatuses, setFriendshipStatuses] = useState([]);

  // Funktion til at hente venneliste fra serveren
  const fetchFriends = async () => {
    try {
      const response = await api.get("friendship/friends/all");
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Funktion til at hente venskabsstatusser fra serveren
  const fetchFriendshipStatuses = async () => {
    try {
      const response = await api.get("friendship/friends/all/statuses");
      console.log(response.data);
      setFriendshipStatuses(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect til at hente venner og venskabsstatusser ved opstart
  useEffect(() => {
    setLoading(true);
    fetchFriends();
    fetchFriendshipStatuses();
  }, []);

  // Funktion til at fjerne en ven fra vennerelationerne
  const removeFriend = async (friendId) => {
    setFriends(friends.filter((friend) => friend.user_id !== friendId));
  };

  // Funktion til at tilføje en ny ven til vennerelationerne
  const addFriend = (newFriend) => {
    setFriends([newFriend, ...friends]);
  };

  // Samlet værdi, der skal deles med underliggende komponenter
  const value = {
    friends,
    loading,
    removeFriend,
    addFriend,
    fetchFriends,
    friendshipStatuses,
    fetchFriendshipStatuses,
  };

  // Returnerer FriendsContext.Provider, som giver konteksten til underliggende komponenter
  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

// Brugerdefineret hook til at bruge vennekonteksten
export const useFriends = () => useContext(FriendsContext);
