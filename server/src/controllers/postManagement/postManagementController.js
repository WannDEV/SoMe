import pool from "../../db";

export const createPost = async (req, res) => {
  try {
    const { userId, content, img } = req.body;
    const query =
      "INSERT INTO post (userID, content, img) VALUES ($1, $2, $3) RETURNING *";
    const values = [userId, content, img];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userId = req.userId;

    // Forespørgsel til at få alle brugerens venner
    const friendsQuery =
      "SELECT friendID FROM friendships WHERE userID = $1 AND status = $2";
    const friendsResult = await pool.query(friendsQuery, [userId, "accepted"]);

    // Looper igennem venneobjekterne og returnerer liste med deres ID'er
    const friendIds = friendsResult.rows.map((row) => row.friend_id);

    // Tilføjer brugerens eget id til vennelisten
    friendIds.push(userId);

    // Forespørgsel til at hente alle opslagene fra listen med ID'er og sorter efter dato
    const postsQuery =
      "SELECT * FROM post WHERE userID = ANY($1::int[]) ORDER BY postDate DESC";
    const postsResult = await pool.query(postsQuery, [friendIds]);

    res.status(200).json(postsResult.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const discoverPosts = async (req, res) => {
  try {
    // Forespørgsel til at hente de nyeste opslag med en begrænsning på 10 opslag
    const query = `
            SELECT *
            FROM post
            ORDER BY postDate DESC
            LIMIT 10; -- Example: Retrieve 10 most recent posts
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
    const query = "SELECT * FROM post WHERE postID = $1";
    const result = await pool.query(query, [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId, content, img } = req.body;
    // Tjek hvis brugeren der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE postID = $1 AND userID = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }
    // Hvis brugeren er ejer af opslaget -> opdater opslaget
    const updateQuery =
      "UPDATE post SET content = $1, img = $2 WHERE postID = $3 RETURNING *";
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
    const userId = req.query.userId;
    // Tjek hvis brugeren der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE postid = $1 AND userid = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    // Hvis brugeren ejer opslaget -> Slet opslaget
    const deleteQuery = "DELETE FROM post WHERE postid = $1 RETURNING *";
    const result = await pool.query(deleteQuery, [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
