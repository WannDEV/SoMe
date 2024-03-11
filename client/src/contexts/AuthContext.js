"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await api.post("auth/logout");
      console.log(response.data);
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect til at hente brugerens data fra serveren
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("user-profile");
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser().then(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
