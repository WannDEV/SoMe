// Importér nødvendige biblioteker og filer
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api"; // Importér en API-klient til at kommunikere med serveren

// Opret en kontekst til håndtering af opslag
const PostsContext = createContext();

// Opret en udbyder (provider) til at håndtere opslag
export const PostsProvider = ({ children, postType, username }) => {
  // Opret tilstandsvariabler til opslag og indlæsningstilstand
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funktion til at hente opslag fra serveren
  const fetchPosts = async () => {
    try {
      let postEndPoint = "";

      // Vælg den korrekte slutpunkt baseret på opslagstypen
      switch (postType) {
        case "discover":
          postEndPoint = "post-management/discover-posts";
          break;
        case "user":
          postEndPoint = `post-management/posts/all/${username}`;
          break;
        case "friends":
          postEndPoint = `post-management/posts`;
          break;
        default:
          postEndPoint = "post-management/posts";
      }

      // Udfør en GET-anmodning til slutpunktet og opdater tilstandsvariabler
      const response = await api.get(postEndPoint);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Effekt til at hente opslag, når opslagstypen ændres
  useEffect(() => {
    // Hvis opslagstypen er "user" og brugernavnet ikke er defineret, stop behandlingen
    if (postType === "user" && !username) {
      setLoading(false);
      return;
    }
    fetchPosts(); // Udfør funktionen til at hente opslag
  }, [postType, username]); // Afhængigheder, der udløser effekten

  // Funktion til at fjerne et opslag
  const removePost = async (postId) => {
    try {
      // Udfør en DELETE-anmodning til at slette opslaget fra serveren
      await api.delete(`post-management/posts/${postId}`);
      // Opdater tilstandsvariablen ved at filtrere det slettede opslag ud
      setPosts(posts.filter((post) => post.post_id !== postId));
    } catch (error) {
      console.error("Fejl ved sletning af opslag:", error);
    }
  };

  // Funktion til at tilføje et nyt opslag
  const addPost = (newPost) => {
    // Tilføj det nye opslag foran i opslagslisten
    setPosts([newPost, ...posts]);
  };

  // Opretter værdien for konteksten, som vil blive delt med underkomponenter
  const value = { posts, loading, removePost, addPost };

  // Returner komponenten med kontekstværdien
  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

// Brugerdefineret hook til at bruge opslagskonteksten i komponenter
export const usePosts = () => useContext(PostsContext);
