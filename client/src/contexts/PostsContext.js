"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const PostsContext = createContext();

export const PostsProvider = ({ children, postType, username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      let postEndPoint = "";

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

      const response = await api.get(postEndPoint);
      console.log(response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postType === "user" && !username) {
      setLoading(false);
      return;
    }
    fetchPosts();
  }, [postType]);

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
