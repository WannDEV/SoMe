"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
        const response = await axios.post("http://localhost:2000/auth/logout", {
            withCredentials: true,
        });
        console.log(response.data);
        router.push("/login");
    } catch (error) {
        console.log(error);
    }
};

  // useEffect to get fetch user from api using axios with the jwt cookie and set user
  useEffect(() => {
    router.push("/login");

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
    fetchUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
