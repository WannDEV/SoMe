import pool from "../../db/index.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.body;
    const query =
      "INSERT INTO friendship (user_id1, user_id2) VALUES ($1, $2) RETURNING *";
    const values = [userId, friendId];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.body;
    const query =
      "UPDATE friendship SET status = $1 WHERE user_id1 = $2 AND user_id2 = $3 RETURNING *";
    const values = ["accepted", friendId, userId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.body;
    const query =
      "DELETE FROM friendship WHERE user_id1 = $1 AND user_id2 = $2 RETURNING *";
    const values = [userId, friendId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query =
      "SELECT app_user.user_id, app_user.username, app_user.profile_picture FROM friendship JOIN app_user ON friendship.user_id2 = app_user.user_id1 WHERE user_id1 = $1 AND status = $2";
    const values = [userId, "accepted"];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;
    const query =
      "DELETE FROM friendship WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1) RETURNING *";
    const values = [userId, friendId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
