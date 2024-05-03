// Importerer 'pool' fra db/index.js, som sandsynligvis er en databaseforbindelse
import pool from "../../db/index.js";

// Funktion til at tilføje en "like" til en post
export const addLike = async (req, res) => {
  try {
    // Henter brugerens id og postens id fra anmodningen
    const userId = req.userId;
    const postId = req.params.postId;

    // Kontrollerer, om brugeren allerede har liket denne post
    const likeQuery =
      "SELECT * FROM post_like WHERE post_id = $1 AND user_id = $2";
    const likeResult = await pool.query(likeQuery, [postId, userId]);
    if (likeResult.rows.length > 0) {
      // Hvis brugeren allerede har liket posten, returneres en fejlmeddelelse
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    // SQL-query til at tilføje en ny "like" til posten i databasen
    const query =
      "INSERT INTO post_like (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 201 (oprettet) og returnerer den nye "like" som JSON
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at fjerne en "like" fra en post
export const removeLike = async (req, res) => {
  try {
    // Henter brugerens id og postens id fra anmodningen
    const userId = req.userId;
    const postId = req.params.postId;
    // SQL-query til at slette brugerens "like" fra posten i databasen
    const query =
      "DELETE FROM post_like WHERE post_id = $1 AND user_id = $2 RETURNING *";
    const values = [postId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og en succesmeddelelse som JSON
    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at tilføje en kommentar til en post
export const addComment = async (req, res) => {
  try {
    // Henter brugerens id, kommentarindhold og postens id fra anmodningen
    const userId = req.userId;
    const { content } = req.body;
    const postId = req.params.postId;

    // Kontrollerer, om kommentarindholdet er tomt
    if (!content.trim()) {
      return res.status(400).json({ message: "Comment can't be empty" });
    }

    // SQL-query til at tilføje en ny kommentar til posten i databasen
    const query =
      "INSERT INTO post_comment (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [postId, userId, content];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 201 (oprettet) og returnerer den nye kommentar som JSON
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at slette en kommentar fra en post
export const deleteComment = async (req, res) => {
  try {
    // Henter brugerens id, postens id og kommentarens id fra URL-parametrene
    const userId = req.userId;
    const { postId, commentId } = req.params;
    // SQL-query til at slette kommentaren fra posten i databasen
    const query =
      "DELETE FROM post_comment WHERE post_id = $1 AND comment_id = $2 AND user_id = $3 RETURNING *";
    const values = [postId, commentId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og en succesmeddelelse som JSON
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at dele en post
export const sharePost = async (req, res) => {
  try {
    // Henter brugerens id og postens id fra anmodningen
    const userId = req.userId;
    const postId = req.params.postId;
    // SQL-query til at tilføje en ny "share" af posten til databasen
    const query =
      "INSERT INTO post_share (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 201 (oprettet) og returnerer den nye "share" som JSON
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at hente kommentarer for en post
export const getComments = async (req, res) => {
  try {
    // Henter postens id fra URL-parametrene
    const postId = req.params.postId;
    // SQL-query til at hente alle kommentarer for en post
    const query =
      "SELECT post_comment.comment_id, post_comment.content, post_comment.comment_date, app_user.username, app_user.profile_picture, app_user.user_id FROM post_comment INNER JOIN app_user ON post_comment.user_id = app_user.user_id WHERE post_comment.post_id = $1";
    const values = [postId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer kommentarerne som JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};
