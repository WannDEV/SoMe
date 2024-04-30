import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendshipStatuses, setFriendshipStatuses] = useState([]);

  const fetchFriends = async () => {
    try {
      const response = await api.get("friendship/friends/all");
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    setLoading(true);
    fetchFriends();
    fetchFriendshipStatuses();
  }, []);

  const removeFriend = async (friendId) => {
    setFriends(friends.filter((friend) => friend.user_id !== friendId));
  };

  const addFriend = (newFriend) => {
    setFriends([newFriend, ...friends]);
  };

  const value = {
    friends,
    loading,
    removeFriend,
    addFriend,
    fetchFriends,
    friendshipStatuses,
    fetchFriendshipStatuses,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
