import React, { useState } from "react"; // Importér React og useState-hooket fra React
import api from "../../utils/api"; // Importér API-funktionalitet fra utils-mappen
import { useAuth } from "../../contexts/AuthContext"; // Importér useAuth-hooket fra AuthContext
import Link from "next/link"; // Importér Link-komponenten fra Next.js
import styles from "./LoginForm.module.css"; // Importér CSS-stilarter fra den lokale fil "LoginForm.module.css"
import { BiSolidError } from "react-icons/bi"; // Importér BiSolidError-ikonet fra react-icons-biblioteket

// Deklarér en funktion med navnet Login
const Login = () => {
  const [email, setEmail] = useState(""); // Opret en state til email-input
  const [password, setPassword] = useState(""); // Opret en state til password-input
  const { login } = useAuth(); // Brug useAuth-hooket til at få adgang til login-funktionen fra AuthContext
  const [error, setError] = useState(null); // Opret en state til fejlmeddelelser

  // Funktion der kaldes ved succesfuld login
  const onSuccess = (response) => {
    login(response.data.user); // Log brugeren ind ved at kalde login-funktionen med brugerdataen fra API-svaret
  };

  // Funktion til at håndtere indsendelse af login-formularen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forhindrer standardformularadfærd (omdirigering)

    try {
      const response = await api.post("auth/login", {
        // Foretag et POST-API-kald til "auth/login" med email og password
        email,
        password,
      });
      onSuccess(response); // Håndter succesfuldt login

      console.log(response.data); // Udskriv API-svaret til konsollen
    } catch (error) {
      setEmail(""); // Nulstil email-input
      setPassword(""); // Nulstil password-input
      setError(error.response.data.message); // Indstil fejlmeddelelsen baseret på svaret fra API'en
    }
  };

  return (
    <div className={styles.container}>
      {/* Opret en div med klassenavn baseret på CSS-stilarter fra "LoginForm.module.css" for container */}
      <h1 className={styles.title}>
        <span>Be</span>Social {/* Overskrift med BeSocial */}
      </h1>
      <hr />
      <h2 className={styles.formTitle}>Login</h2>{" "}
      {/* Overskrift for login-formularen */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Login-formularen med onSubmit-event og klasse baseret på CSS-stilarter */}
        <div>
          <label>Email</label> {/* Etiket for email-input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Lyt efter ændringer i email-input og opdater state
            placeholder="your@email.com" // Placeholder-tekst for email-input
          />
        </div>
        <div>
          <label>Password</label> {/* Etiket for password-input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Lyt efter ændringer i password-input og opdater state
            placeholder="********" // Placeholder-tekst for password-input
          />
        </div>
        {/* Vis fejlmeddelelse, hvis der opstår en fejl */}
        {error && (
          <span className={styles.error}>
            {" "}
            {/* Vis fejlmeddelelsen med ikon og tekst, baseret på CSS-stilarter */}
            <BiSolidError size={24} /> {/* Vis BiSolidError-ikonet */}
            {error} {/* Vis fejlteksten */}
          </span>
        )}
        <button type="submit" disabled={email == "" || password == ""}>
          {/* Submit-knap til login-formularen, deaktiveret hvis email eller password er tomme */}
          Login
        </button>
        <span className={styles.register}>
          {/* Tekst der linker til registreringssiden */}
          Don&apos;t have an account?&nbsp; {/* Tekst: Har du ikke en konto? */}
          <Link href="/register">Register here</Link>{" "}
          {/* Link til registreringssiden */}
        </span>
      </form>
    </div>
  );
};

export default Login; // Eksportér Login-komponenten
