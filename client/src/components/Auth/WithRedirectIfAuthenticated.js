"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export const withRedirectIfAuthenticated = (Component) => {
  return function withRedirectIfAuthenticated(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && user) {
        router.push("/");
      }
    }, [loading, user, router]);

    if (loading || user) {
      return null;
    }

    return <Component {...props} />;
  };
};