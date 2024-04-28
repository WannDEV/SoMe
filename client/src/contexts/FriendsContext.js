import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const response = await api.get("friendship/friends/all");
      console.log(response.data);
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const removeFriend = async (friendId) => {
    try {
      await api.delete(`friendship/friends/${friendId}`);
      setFriends(friends.filter((friend) => friend.friend_id !== friendId));
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  const addFriend = (newFriend) => {
    setFriends([newFriend, ...friends]);
  };

  const value = { friends, loading, removeFriend, addFriend };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
