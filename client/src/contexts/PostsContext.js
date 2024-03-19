"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("post-management/posts");
        console.log(response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const removePost = async (postId) => {
    try {
      await api.delete(`post-management/posts/${postId}`);
      setPosts(posts.filter((post) => post.post_id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const value = { posts, loading, removePost, addPost };

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
