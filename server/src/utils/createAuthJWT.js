// Importér jwt-biblioteket til at arbejde med JSON Web Tokens
import jwt from "jsonwebtoken";

// Funktion til oprettelse af en JWT for en given bruger-id
export const createAuthJWT = (userId) => {
  // Signér en JWT med det givne bruger-id, ved hjælp af en hemmelig nøgle fra miljøvariablen JWT_SECRET
  // JWT'en udløber efter 1 time (3600 sekunder)
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
