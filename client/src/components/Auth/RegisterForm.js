import React, { useState } from "react"; // Importér React og useState-hooket fra React
import api from "../../utils/api"; // Importér API-funktionalitet fra utils-mappen
import { useAuth } from "../../contexts/AuthContext"; // Importér useAuth-hooket fra AuthContext
import styles from "./RegisterForm.module.css"; // Importér CSS-stilarter fra den lokale fil "RegisterForm.module.css"
import Link from "next/link"; // Importér Link-komponenten fra Next.js
import { BiSolidError } from "react-icons/bi"; // Importér BiSolidError-ikonet fra react-icons-biblioteket

// Deklarér en funktion med navnet RegisterForm
const RegisterForm = () => {
  const [username, setUsername] = useState(""); // Opret en state til username-input
  const [email, setEmail] = useState(""); // Opret en state til email-input
  const [password, setPassword] = useState(""); // Opret en state til password-input
  const { login } = useAuth(); // Brug useAuth-hooket til at få adgang til login-funktionen fra AuthContext
  const [error, setError] = useState({
    // Opret en state til fejlmeddelelser med generel fejl og fejl for hver input
    general: "",
    username: "",
    email: "",
    password: "",
  });

  // Funktion til at håndtere ændringer i username-input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Funktion til at håndtere ændringer i email-input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Funktion til at håndtere ændringer i password-input
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Funktion der kaldes ved succesfuld registrering
  const onSuccess = (response) => {
    login(response.data.user); // Log brugeren ind ved at kalde login-funktionen med brugerdataen fra API-svaret
  };

  // Funktion til at håndtere indsendelse af registreringsformularen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Forhindrer standardformularadfærd (omdirigering)

    try {
      const response = await api.post("auth/register", {
        // Foretag et POST-API-kald til "auth/register" med username, email og password
        username,
        email,
        password,
      });
      onSuccess(response); // Håndter succesfuld registrering

      console.log(response.data); // Udskriv API-svaret til konsollen
    } catch (err) {
      console.log(err);
      setError({ ...err.response.data }); // Opdater fejlmeddelelser baseret på svaret fra API'en
    }
  };

  // Funktion til validering af username
  const validateUsername = (username) => {
    if (username === "") return "Username is required"; // Kontroller om username er tomt
    if (username.length < 4) return "Username must be 4 characters or more"; // Kontroller længden af username
    const re = /^[a-zA-Z0-9]*$/; // Regulært udtryk for tilladte karakterer i username
    if (!re.test(username))
      return "Username must contain only letters and numbers"; // Kontroller karaktererne i username
    return ""; // Returner tom streng hvis validering er vellykket
  };

  // Funktion til validering af email
  const validateEmail = (email) => {
    if (email === "") return "Email is required"; // Kontroller om email er tomt
    const re = /\S+@\S+\.\S+/; // Regulært udtryk for gyldig email-format
    if (!re.test(email)) return "Invalid email address"; // Kontroller email-format
    return ""; // Returner tom streng hvis validering er vellykket
  };

  // Funktion til validering af password
  const validatePassword = (password) => {
    if (password === "") return "Password is required"; // Kontroller om password er tomt
    const re = /\S{8,}/; // Regulært udtryk for minimum 8 tegn i password
    if (!re.test(password)) return "Password must be 8 characters or more"; // Kontroller længden af password
    const re2 = /[A-Z]/; // Regulært udtryk for mindst én stort bogstav i password
    if (!re2.test(password))
      return "Password must contain at least one uppercase letter"; // Kontroller om password indeholder mindst ét stort bogstav
    const re3 = /[a-z]/; // Regulært udtryk for mindst én lille bogstav i password
    if (!re3.test(password))
      return "Password must contain at least one lowercase letter"; // Kontroller om password indeholder mindst ét lille bogstav
    const re4 = /\d/; // Regulært udtryk for mindst én ciffer i password
    if (!re4.test(password)) return "Password must contain at least one number"; // Kontroller om password indeholder mindst ét ciffer
    return ""; // Returner tom streng hvis validering er vellykket
  };

  return (
    <div className={styles.container}>
      {/* Opret en div med klassenavn baseret på CSS-stilarter fra "RegisterForm.module.css" for container */}
      <h1 className={styles.title}>
        <span>Be</span>Social {/* Overskrift med BeSocial */}
      </h1>
      <hr />
      <h2 className={styles.formTitle}>Register</h2>{" "}
      {/* Overskrift for registreringsformularen */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Registreringsformular med onSubmit-event og klasse baseret på CSS-stilarter */}
        <div className={styles.field}>
          {/* Div med klasse for hvert formularfelt */}
          <label>Username</label> {/* Etiket for username-input */}
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange} // Lyt efter ændringer i username-input og opdater state
            placeholder="JohnDoe" // Placeholder-tekst for username-input
            className={`${styles.fieldInput} ${
              error.username && styles.fieldError
            }`} // Styling af input-feltet baseret på fejlstatus
            onBlur={
              (e) =>
                setError({
                  ...error,
                  username: validateUsername(e.target.value),
                }) // Valider username ved at kalde validateUsername-funktionen
            }
          />
          {error.username && (
            <span className={styles.errorSpecific}>{error.username}</span> // Vis specifik fejlmeddelelse for username-input, hvis der er fejl
          )}
          <br />
        </div>
        <div className={styles.field}>
          {/* Div med klasse for hvert formularfelt */}
          <label>Email</label> {/* Etiket for email-input */}
          <input
            type="email"
            value={email}
            onChange={handleEmailChange} // Lyt efter ændringer i email-input og opdater state
            placeholder="your@email.com" // Placeholder-tekst for email-input
            className={`${styles.fieldInput} ${
              error.email && styles.fieldError
            }`} // Styling af input-feltet baseret på fejlstatus
            onBlur={
              (e) =>
                setError({ ...error, email: validateEmail(e.target.value) }) // Valider email ved at kalde validateEmail-funktionen
            }
          />
          {error.email && (
            <span className={styles.errorSpecific}>{error.email}</span> // Vis specifik fejlmeddelelse for email-input, hvis der er fejl
          )}
          <br />
        </div>
        <div className={styles.field}>
          {/* Div med klasse for hvert formularfelt */}
          <label>Password</label> {/* Etiket for password-input */}
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange} // Lyt efter ændringer i password-input og opdater state
            placeholder="********" // Placeholder-tekst for password-input
            className={`${styles.fieldInput} ${
              error.password && styles.fieldError
            }`} // Styling af input-feltet baseret på fejlstatus
            onBlur={
              (e) =>
                setError({
                  ...error,
                  password: validatePassword(e.target.value),
                }) // Valider password ved at kalde validatePassword-funktionen
            }
          />
          {error.password && (
            <span className={styles.errorSpecific}>{error.password}</span> // Vis specifik fejlmeddelelse for password-input, hvis der er fejl
          )}
          <br />
        </div>
        {error.general && (
          <span className={styles.error}>
            {/* Generel fejlmeddelelse, hvis der er en generel fejl */}
            <BiSolidError size={24} /> {/* Vis BiSolidError-ikonet */}
            {error.general} {/* Vis generel fejltekst */}
          </span>
        )}
        <button
          type="submit"
          disabled={username == "" || email == "" || password == ""} // Deaktiver registreringsknappen hvis nogen af inputfelterne er tomme
        >
          Register
        </button>
        <span className={styles.login}>
          {/* Tekst der linker til login-siden */}
          Already have an account?&nbsp;{" "}
          {/* Tekst: Har du allerede en konto? */}
          <Link href="/login">Login here</Link> {/* Link til login-siden */}
        </span>
      </form>
    </div>
  );
};

export default RegisterForm; // Eksportér RegisterForm-komponenten
