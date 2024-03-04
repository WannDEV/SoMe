"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
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
      const response = await axios.post(
        "http://localhost:2000/auth/logout",
        null,
        {
          withCredentials: true,
        }
      );
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
        const response = await axios.get("http://localhost:2000/user-profile", {
          withCredentials: true,
        });
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
