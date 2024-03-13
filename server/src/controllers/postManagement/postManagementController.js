import pool from "../../db/index.js";
import { upload } from "../../utils/s3-aws.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.userId;

    // Use multer middleware to handle image upload
    await upload.single("image")(req, res, async (err) => {
      const { content } = req.body;
      let img = null;

      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Error uploading image" });
      }
      if (req.file) {
        img = req.file.location;
      }

      const query =
        "INSERT INTO post (user_id, content, img) VALUES ($1, $2, $3) RETURNING *";
      const values = [userId, content, img];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all accepted friend IDs for the user
    const friendsQuery = `
      SELECT f.user_id2 AS friend_id
      FROM friendship f
      WHERE f.user_id1 = $1
      AND f.status = $2
    `;
    const friendsResult = await pool.query(friendsQuery, [userId, "accepted"]);

    // Extract friend IDs and include user's own ID
    const friendIds = friendsResult.rows.map((row) => row.friend_id);
    friendIds.push(userId);

    // Optimized query with subqueries and check for user like
    const postsQuery = `
      SELECT 
        p.post_id,
        p.user_id,
        p.content,
        p.img,
        p.post_date,
        u.username,
        u.profile_picture,
        (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = p.post_id) AS likes_count,
        (SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = p.post_id) AS comments_count,
        (SELECT COUNT(*) FROM post_share WHERE post_share.post_id = p.post_id) AS shares_count,
        (SELECT EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = p.post_id AND post_like.user_id = $2)) AS has_liked
      FROM post p
      INNER JOIN app_user u ON p.user_id = u.user_id
      WHERE p.user_id = ANY($1::int[]) -- Array of friend IDs
      OR p.user_id = $2 -- Current user's ID
      ORDER BY p.post_date DESC
    `;
    const postsResult = await pool.query(postsQuery, [friendIds, userId]);

    res.status(200).json(postsResult.rows);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" }); // Generic error message for the user
  }
};

export const discoverPosts = async (req, res) => {
  try {
    // Forespørgsel til at hente de nyeste opslag med en begrænsning på 10 opslag
    const query = `
            SELECT *
            FROM post
            ORDER BY post_date DESC
            LIMIT 10; 
        `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Optimized query with subqueries and check for user like (similar to getPosts)
    const query = `
      SELECT 
        p.post_id,
        p.user_id,
        p.content,
        p.img,
        p.post_date,
        u.username,
        u.profile_picture,
        (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = p.post_id) AS likes_count,
        (SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = p.post_id) AS comments_count,
        (SELECT COUNT(*) FROM post_share WHERE post_share.post_id = p.post_id) AS shares_count,
        (SELECT EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = p.post_id AND post_like.user_id = $2)) AS has_liked
      FROM post p
      INNER JOIN app_user u ON p.user_id = u.user_id
      WHERE p.post_id = $1
    `;

    const result = await pool.query(query, [postId, req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const { content, img } = req.body;
    // Tjek hvis brugeren der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE post_id = $1 AND user_id = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
    // Hvis brugeren er ejer af opslaget -> opdater opslaget
    const updateQuery =
      "UPDATE post SET content = $1, img = $2 WHERE post_id = $3 RETURNING *";
    const updateValues = [content, img, postId];
    const result = await pool.query(updateQuery, updateValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    // Tjek hvis brugeren der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE post_id = $1 AND user_id = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    // Hvis brugeren ejer opslaget -> Slet opslaget
    const deleteQuery = "DELETE FROM post WHERE post_id = $1 RETURNING *";
    const result = await pool.query(deleteQuery, [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
