"use client"; // Importér klientmodulet

import LoginForm from "../../components/Auth/LoginForm"; // Importér LoginForm-komponenten fra Auth-mappen
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated"; // Importér WithRedirectIfAuthenticated-højere ordens komponenten fra Auth-mappen
import styles from "./page.module.css"; // Importér CSS-stilarter fra den lokale fil "page.module.css"

// Deklarér en funktion med navnet Login
const Login = () => {
  return (
    <div className={styles.background}>
      {" "}
      {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for baggrund */}
      <div className={styles.container}>
        {" "}
        {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for container */}
        <LoginForm /> {/* Indsæt LoginForm-komponenten */}
      </div>
    </div>
  );
};

// Eksportér Login-komponenten med WithRedirectIfAuthenticated-højere ordens komponent, der viderestiller hvis brugeren allerede er autentificeret
export default WithRedirectIfAuthenticated(Login);
