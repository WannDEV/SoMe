// Importér nødvendige moduler og biblioteker
import bcrypt from "bcrypt"; // Bibliotek til kryptering af adgangskoder
import pool from "../../db/index.js"; // Databaseforbindelse
import { createAuthJWT } from "../../utils/createAuthJWT.js"; // Funktion til oprettelse af JSON Web Tokens (JWT)

// Controller-funktion til brugerregistrering
export const register = async (req, res) => {
  try {
    // Udtræk data fra anmodningen
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Valider at alle nødvendige felter er angivet
    if (!email || !username || !password) {
      return res.status(400).json({ general: "Missing required fields" });
    }

    // Valider længden af ​​brugernavnet
    if (username.length < 3) {
      return res
        .status(400)
        .json({ username: "Username must be at least 3 characters long" });
    }

    // Valider e-mailadresseformatet
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ email: "Invalid email" });
    }

    // Valider adgangskodelængden og kompleksitet
    if (password.length < 8) {
      return res.status(400).json({
        password: "Password must be at least 8 characters long",
      });
    }
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one uppercase letter",
      });
    }
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one lowercase letter",
      });
    }
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one number",
      });
    }

    // Tjek om brugeren allerede eksisterer i databasen
    const userExistsquery =
      "SELECT * FROM app_user WHERE email = $1 OR username = $2";
    const { rows } = await pool.query(userExistsquery, [
      req.body.email,
      req.body.username,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ general: "User already exists" });
    }

    // Hash adgangskoden
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Indsæt brugeren i databasen
    const query =
      "INSERT INTO app_user (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.body.username, req.body.email, hashedPassword];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    // Opret en JWT og send den som en httpOnly-cookie
    const token = createAuthJWT(user.user_id);
    res.cookie("authToken", `${token}`, {
      httpOnly: true,
    });

    // Send bekræftelse og brugeroplysninger som svar
    res.status(201).json({
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationDate: user.registration_date,
      },
    });
  } catch (error) {
    // Håndter fejl og send fejlmeddelelse som svar
    res.status(500).json({ message: error.message });
  }
};

// Controller-funktion til brugerlogin
export const login = async (req, res) => {
  try {
    // Udtræk data fra anmodningen
    const password = req.body.password;
    const email = req.body.email;

    // Valider at nødvendige felter er angivet
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email address and password to log in.",
      });
    }

    // Find brugeren i databasen baseret på e-mailadresse
    const query = "SELECT * FROM app_user WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    // Håndter tilfælde, hvor brugeren ikke findes
    if (rows.length === 0) {
      return res.status(404).json({
        message:
          "We couldn't find an account associated with that email address.",
      });
    }

    // Sammenlign adgangskoden med den hashede adgangskode fra databasen
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "The password you entered is incorrect. Please try again.",
      });
    }

    // Generer en JWT og send den som en httpOnly-cookie
    const token = createAuthJWT(user.user_id);
    res.cookie("authToken", token, {
      httpOnly: true,
    });

    // Send brugeroplysninger som svar
    res.status(200).json({
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture,
        registrationDate: user.registration_date,
      },
    });
  } catch (error) {
    // Håndter fejl og send fejlmeddelelse som svar
    console.error(error); // Log den faktiske fejl for fejlfinding
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// Controller-funktion til brugerlogud
export const logout = (req, res) => {
  // Ryd JWT-cookie og send bekræftelse som svar
  res.clearCookie("authToken").status(200).json({ message: "Logged out" });
};
