"use client"; // Importér klientmodulet

import { useRouter } from "next/navigation"; // Importér useRouter-hooket fra Next.js-navigationmodulet
import { useAuth } from "../../contexts/AuthContext"; // Importér useAuth-hooket fra AuthContext
import { useEffect } from "react"; // Importér useEffect-hooket fra React

// Funktion der tilføjer en redirect, hvis brugeren er autentificeret
export const WithRedirectIfAuthenticated = (Component) => {
  return function WithRedirectIfAuthenticated(props) {
    const router = useRouter(); // Brug useRouter-hooket til at få adgang til routeren
    const { user, loading } = useAuth(); // Brug useAuth-hooket til at få adgang til brugeroplysninger og indlæsningsstatus

    // Effekt der udføres, når komponenten er blevet monteret
    useEffect(() => {
      // Hvis indlæsning er færdig og brugeren er logget ind, omdiriger til startsiden
      if (!loading && user) {
        router.push("/"); // Omdiriger til startsiden
      }
    }, [loading, user, router]); // Afhængigheder inkluderer indlæsningsstatus, brugeroplysninger og routeren

    // Hvis der stadig indlæses eller brugeren er logget ind, returner intet
    if (loading || user) {
      return null;
    }

    // Ellers, returner det indlejrede komponent med dets props
    return <Component {...props} />;
  };
};
