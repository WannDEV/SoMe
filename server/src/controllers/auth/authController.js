import bcrypt from "bcrypt";
import pool from "../../db/index.js";
import { createAuthJWT } from "../../utils/createAuthJWT.js";

export const register = async (req, res) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if username is longer than 3 characters
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    const userExistsquery =
      "SELECT * FROM app_user WHERE email = $1 OR username = $2";
    const { rows } = await pool.query(userExistsquery, [
      req.body.email,
      req.body.username,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
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
    const query = "SELECT * FROM app_user WHERE email = $1";
    const { rows } = await pool.query(query, [req.body.email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.hashed_password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
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
    res.status(500).json({ message: error.message });
  }
};

// logout route that removes httponly cookie
export const logout = (req, res) => {
  res.clearCookie("authToken").status(200).json({ message: "Logged out" });
};
