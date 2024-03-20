import pool from "../../db/index.js";

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = !req.params.userId ? req.userId : req.params.userId;

    if (!isInt(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const query =
      "SELECT username, email, profile_picture, registration_date FROM app_user WHERE user_id = $1";
    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];

    res.status(200).json({
      user: {
        userId,
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

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email, profilePicture } = req.body;
    const query =
      "UPDATE app_user SET username = $1, email = $2, profile_picture = $3 WHERE user_id = $4 RETURNING *";
    const values = [username, email, profilePicture, userId];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result.rows[0];

    res.status(200).json({
      user: {
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

export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete user
    const deleteUserQuery =
      "DELETE FROM app_user WHERE user_id = $1 RETURNING *";
    const deleteUserResult = await pool.query(deleteUserQuery, [userId]);
    if (deleteUserResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
