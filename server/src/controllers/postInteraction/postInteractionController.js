import pool from "../../db";

export const addLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;
    const query =
      "INSERT INTO like (postID, userID) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;
    const query =
      "DELETE FROM like WHERE postID = $1 AND user_id = $2 RETURNING *";
    const values = [postId, userId];
    const result = await pool.query(query, values);
    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const postId = req.params.postId;
    const query =
      "INSERT INTO comment (postID, userID, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [postId, userId, content];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId, commentId } = req.params;
    const query =
      "DELETE FROM comment WHERE postID = $1 AND commentID = $2 AND userID = $3 RETURNING *";
    const values = [postId, commentId, userId];
    const result = await pool.query(query, values);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
