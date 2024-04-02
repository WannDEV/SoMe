import bcrypt from "bcrypt";
import pool from "../../db/index.js";
import { createAuthJWT } from "../../utils/createAuthJWT.js";

export const register = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    if (!email || !username || !password) {
      return res.status(400).json({ general: "Missing required fields" });
    }

    // check if username is longer than 3 characters
    if (username.length < 3) {
      return res
        .status(400)
        .json({ username: "Username must be at least 3 characters long" });
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ email: "Invalid email" });
    }

    // check password length
    if (password.length < 8) {
      return res.status(400).json({
        password: "Password must be at least 8 characters long",
      });
    }

    // check for uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one uppercase letter",
      });
    }

    // check for lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one lowercase letter",
      });
    }

    // check for number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      return res.status(400).json({
        password: "Password must contain at least one number",
      });
    }

    const userExistsquery =
      "SELECT * FROM app_user WHERE email = $1 OR username = $2";
    const { rows } = await pool.query(userExistsquery, [
      req.body.email,
      req.body.username,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ general: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const query =
      "INSERT INTO app_user (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.body.username, req.body.email, hashedPassword];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    const token = createAuthJWT(user.user_id);
    res.cookie("authToken", `${token}`, {
      httpOnly: true,
    });
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
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;

    // Check for missing required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter your email address and password to log in.",
      });
    }

    // Attempt to find user by email
    const query = "SELECT * FROM app_user WHERE email = $1";
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      // User not found - provide options for account creation or password reset
      return res.status(404).json({
        message:
          "We couldn't find an account associated with that email address.",
      });
    }

    const user = rows[0];

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "The password you entered is incorrect. Please try again.",
      });
    }

    // Successful login - generate and send auth token
    const token = createAuthJWT(user.user_id);
    res.cookie("authToken", token, {
      httpOnly: true,
    });
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
    console.error(error); // Log the actual error for debugging
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// logout route that removes httponly cookie
export const logout = (req, res) => {
  res.clearCookie("authToken").status(200).json({ message: "Logged out" });
};
