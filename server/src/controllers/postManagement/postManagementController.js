import pool from "../../db/index.js"; // Importerer databaseforbindelse
import { upload } from "../../utils/s3-aws.js"; // Importerer filopladningsfunktion fra AWS-værktøjer

// Funktion til at oprette et opslag
export const createPost = async (req, res) => {
  try {
    const userId = req.userId; // Hent brugerens ID fra anmodningen

    // Upload billedet, hvis det er inkluderet i anmodningen
    await upload.single("image")(req, res, async (err) => {
      const { content } = req.body; // Hent opslagets indhold fra anmodningen
      let img = null;

      if (err) {
        // Hvis der opstår en fejl under upload af billedet
        console.error(err);
        return res.status(400).json({ message: "Fejl ved upload af billede" });
      }
      if (req.file) {
        // Hvis der er blevet uploadet et billede
        img = req.file.location; // Hent billedets URL fra anmodningen
      }

      // Indsæt opslaget i databasen med brugerens ID, indhold og billede
      const query =
        "INSERT INTO post (user_id, content, img) VALUES ($1, $2, $3) RETURNING *";
      const values = [userId, content, img];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]); // Send svar med det oprettede opslag
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Håndter fejl ved oprettelse af opslag
  }
};

// Funktion til at hente alle opslag
export const getPosts = async (req, res) => {
  try {
    const userId = req.userId; // Hent brugerens ID fra anmodningen

    // Forespørgsel til at hente opslag fra brugerens venner og sig selv
    const friendsQuery = `
      SELECT f.user_id2 AS friend_id
      FROM friendship f
      WHERE f.user_id1 = $1
      AND f.status = $2
    `;
    const friendsResult = await pool.query(friendsQuery, [userId, "accepted"]);

    const friendIds = friendsResult.rows.map((row) => row.friend_id);
    friendIds.push(userId);

    // Forespørgsel til at hente opslag baseret på brugerens og deres venners ID'er
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
      WHERE p.user_id = ANY($1::int[]) -- Array af ven-ID'er
      OR p.user_id = $2 -- Nuværende brugers ID
      ORDER BY p.post_date DESC
    `;
    const postsResult = await pool.query(postsQuery, [friendIds, userId]);

    res.status(200).json(postsResult.rows); // Send opslag som svar
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Intern serverfejl" }); // Håndter fejl ved hentning af opslag
  }
};

// Funktion til at opdage nye opslag
export const discoverPosts = async (req, res) => {
  try {
    const userId = req.userId; // Hent brugerens ID fra anmodningen

    // Forespørgsel til at hente de nyeste opslag med en begrænsning på 10 opslag
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
          (SELECT EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = p.post_id AND post_like.user_id = $1)) AS has_liked
        FROM post p
        INNER JOIN app_user u ON p.user_id = u.user_id
        ORDER BY p.post_date DESC
        LIMIT 10
    `;

    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows); // Send opslag som svar
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message }); // Håndter fejl ved opdagelse af opslag
  }
};

// Funktion til at hente et specifikt opslag
export const getPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Hent opslags-ID fra anmodningen

    // Forespørgsel til at hente et specifikt opslag baseret på dets ID
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
      // Hvis opslaget ikke blev fundet
      return res.status(404).json({ message: "Opslag blev ikke fundet" });
    }

    res.status(200).json(result.rows[0]); // Send opslaget som svar
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Intern serverfejl" }); // Håndter fejl ved hentning af opslag
  }
};

// Funktion til at hente alle opslag for en bestemt bruger
export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username; // Hent brugernavn fra anmodningen

    // Forespørgsel til at hente brugerens ID baseret på brugernavn
    const userQuery = "SELECT user_id FROM app_user WHERE username = $1";
    const userResult = await pool.query(userQuery, [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Bruger blev ikke fundet" });
    }

    const userId = userResult.rows[0].user_id;

    // Forespørgsel til at hente alle opslag for en bestemt bruger
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
        (SELECT EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = p.post_id AND post_like.user_id = $1)) AS has_liked
      FROM post p
      INNER JOIN app_user u ON p.user_id = u.user_id
      WHERE p.user_id = $1
      ORDER BY p.post_date DESC
    `;

    const postsResult = await pool.query(postsQuery, [userId]);

    res.status(200).json(postsResult.rows); // Send opslag som svar
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Intern serverfejl" }); // Håndter fejl ved hentning af opslag
  }
};

// Funktion til at opdatere et opslag
export const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.postId;
    const { content, img } = req.body;

    // Kontroller, om brugeren, der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE post_id = $1 AND user_id = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({
          message: "Du har ikke tilladelse til at opdatere dette opslag",
        });
    }

    // Hvis brugeren er ejer af opslaget -> Opdater opslaget
    const updateQuery =
      "UPDATE post SET content = $1, img = $2 WHERE post_id = $3 RETURNING *";
    const updateValues = [content, img, postId];
    const result = await pool.query(updateQuery, updateValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Opslag blev ikke fundet" });
    }

    res.status(200).json(result.rows[0]); // Send opdateret opslag som svar
  } catch (error) {
    res.status(500).json({ message: error.message }); // Håndter fejl ved opdatering af opslag
  }
};

// Funktion til at slette et opslag
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    // Kontroller, om brugeren, der udfører handlingen, er ejeren af opslaget
    const ownershipQuery =
      "SELECT * FROM post WHERE post_id = $1 AND user_id = $2";
    const ownershipResult = await pool.query(ownershipQuery, [postId, userId]);
    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Du har ikke tilladelse til at slette dette opslag" });
    }

    // Hvis brugeren ejer opslaget -> Slet opslaget
    const deleteQuery = "DELETE FROM post WHERE post_id = $1 RETURNING *";
    const result = await pool.query(deleteQuery, [postId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Opslag blev ikke fundet" });
    }

    res.status(200).json({ message: "Opslag slettet med succes" }); // Send svar om sletning af opslag
  } catch (error) {
    res.status(500).json({ message: error.message }); // Håndter fejl ved sletning af opslag
  }
};
