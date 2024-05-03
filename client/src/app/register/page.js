"use client"; // Importér klientmodulet

import RegisterForm from "../../components/Auth/RegisterForm"; // Importér RegisterForm-komponenten fra Auth-mappen
import { WithRedirectIfAuthenticated } from "../../components/Auth/WithRedirectIfAuthenticated"; // Importér WithRedirectIfAuthenticated-højere ordens komponenten fra Auth-mappen
import styles from "./page.module.css"; // Importér CSS-stilarter fra den lokale fil "page.module.css"

// Deklarér en funktion med navnet Register
const Register = () => {
  return (
    <div className={styles.background}>
      {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for baggrund */}
      <div className={styles.container}>
        {/* Opret en div med klassenavn baseret på CSS-stilarter fra "page.module.css" for container */}
        <RegisterForm /> {/* Indsæt RegisterForm-komponenten */}
      </div>
    </div>
  );
};

// Eksportér Register-komponenten med WithRedirectIfAuthenticated-højere ordens komponenten, der viderestiller hvis brugeren allerede er autentificeret
export default WithRedirectIfAuthenticated(Register);
