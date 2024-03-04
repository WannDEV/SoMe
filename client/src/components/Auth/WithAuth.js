import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export const withAuth = (Component) => {
  return function WithAuth(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return null;
    }

    return <Component {...props} />;
  };
};
