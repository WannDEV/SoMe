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
    console.log("friendId", friendId)
    const query =
      "UPDATE friendship SET status = $1 WHERE user_id1 = $2 AND user_id2 = $3 RETURNING *";
    const values = ["accepted", userId, friendId];
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
    const userId = req.userId;
    const { friendStatus } = req.params;
    let query;
    let values;

    if (friendStatus === "pending") {
      query =
        "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au JOIN friendship f ON au.user_id = f.user_id2 WHERE user_id1 = $1 AND status = $2;";
      values = [userId, "pending"];
    } else if (friendStatus === "accepted") {
      query =
        "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au JOIN friendship f ON au.user_id = f.user_id2 WHERE user_id1 = $1 AND status = $2";
      values = [userId, "accepted"];
    } else if (friendStatus === "all") {
      query =
        "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au JOIN friendship f ON au.user_id = f.user_id2 WHERE user_id1 = $1;";
      values = [userId];
    } else {
      return res.status(400).json({ message: "Invalid friend status" });
    }

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

export const searchFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const { searchQuery } = req.params;
    console.log(searchQuery);
    const query =
      "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au LEFT JOIN friendship f ON au.user_id = f.user_id2 WHERE au.username ILIKE $1 AND au.user_id != $2;";
    const values = [`%${searchQuery}%`, userId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
