// Importér nødvendige hooks og biblioteker
import { useRouter } from "next/navigation"; // Hook til at få adgang til routeren i Next.js
import { useAuth } from "../../contexts/AuthContext"; // Brugerdefineret hook til at få adgang til autentificeringstilstanden
import { useEffect } from "react"; // Hook til at udføre sideeffekter i React-komponenter

// Definér en HOC (Higher Order Component) kaldet "WithAuth"
export const WithAuth = (Component) => {
  return function WithAuth(props) {
    const router = useRouter(); // Brug router-hooket til at få adgang til routeren
    const { user, loading } = useAuth(); // Brug autentificeringshooket til at få adgang til autentificeringstilstanden

    // Effekt til at håndtere autentificeringstjekket
    useEffect(() => {
      // Hvis indlæsning er afsluttet, og brugeren ikke er logget ind, omdiriger til login-siden
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user, router]); // Afhængigheder, der udløser effekten

    // Hvis der stadig indlæses eller brugeren ikke er logget ind, returner null (intet indhold)
    if (loading || !user) {
      return null;
    }

    // Hvis brugeren er logget ind, returner den oprindelige komponent med de givne props
    return <Component {...props} />;
  };
};
