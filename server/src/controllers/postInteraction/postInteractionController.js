import pool from "../../db/index.js";

export const addLike = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;

    // Check if the user has already liked the post
    const likeQuery =
      "SELECT * FROM post_like WHERE post_id = $1 AND user_id = $2";
    const likeResult = await pool.query(likeQuery, [postId, userId]);
    if (likeResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    const query =
      "INSERT INTO post_like (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeLike = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const query =
      "DELETE FROM post_like WHERE post_id = $1 AND user_id = $2 RETURNING *";
    const values = [postId, userId];
    const result = await pool.query(query, values);
    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { content } = req.body;
    const postId = req.params.postId;

    // if the comment is empty
    if (!content.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    const query =
      "INSERT INTO post_comment (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [postId, userId, content];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId, commentId } = req.params;
    const query =
      "DELETE FROM post_comment WHERE post_id = $1 AND comment_id = $2 AND user_id = $3 RETURNING *";
    const values = [postId, commentId, userId];
    const result = await pool.query(query, values);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to share a post
export const sharePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const query =
      "INSERT INTO post_share (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const query =
      "SELECT post_comment.comment_id, post_comment.content, post_comment.comment_date, app_user.username, app_user.profile_picture FROM post_comment INNER JOIN app_user ON post_comment.user_id = app_user.user_id WHERE post_comment.post_id = $1";
    const values = [postId];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
