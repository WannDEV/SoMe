import pool from "../../db/index.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query =
      "SELECT username, email, profilePicture, registrationDate FROM users WHERE userID = $1";
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email, profilePicture } = req.body;
    const query =
      "UPDATE users SET username = $1, email = $2, profilePicture = $3 WHERE userID = $4 RETURNING *";
    const values = [username, email, profilePicture, userId];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete user
    const deleteUserQuery = "DELETE FROM users WHERE userID = $1 RETURNING *";
    const deleteUserResult = await pool.query(deleteUserQuery, [userId]);
    if (deleteUserResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
