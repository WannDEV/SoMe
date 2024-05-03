"use client";
import { createContext, useContext, useState, useEffect } from "react"; // Import af hooks og createContext fra React
import api from "../utils/api"; // Import af API-funktionalitet

// Oprettelse af kontekst til brugerautentificering
const AuthContext = createContext();

// Brugerautentificeringsudbyderkomponent
export const AuthProvider = ({ children }) => {
  // Tilstande til brugeroplysninger og indlæsningsstatus
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funktion til login, der opdaterer brugeroplysninger
  const login = (userData) => {
    setUser(userData);
  };

  // Funktion til logout, der rydder brugeroplysninger
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

  // useEffect til at hente brugerens data fra serveren ved opstart
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("user-profile/");
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser().then(() => setLoading(false)); // Hentning af data og opdatering af indlæsningsstatus
  }, []);

  // Returnerer AuthContext.Provider, som giver konteksten til underliggende komponenter
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Brugerdefineret hook til at bruge brugerautentificeringskonteksten
export const useAuth = () => useContext(AuthContext);
