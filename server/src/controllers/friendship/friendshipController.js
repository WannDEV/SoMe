// Importerer 'pool' fra db/index.js, der sandsynligvis er en databaseforbindelse
import pool from "../../db/index.js";

// Funktion til at sende en venneanmodning
export const sendFriendRequest = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter venne-id'et fra anmodningslegemet
    const { friendId } = req.body;
    // SQL-query til at indsætte en ny række i 'friendship' tabellen og returnere den
    const query =
      "INSERT INTO friendship (user_id1, user_id2) VALUES ($1, $2) RETURNING *";
    const values = [userId, friendId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 201 (oprettet) og returnerer den nye række som JSON
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at acceptere en venneanmodning
export const acceptFriendRequest = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter venne-id'et fra anmodningslegemet
    const { friendId } = req.body;
    // SQL-query til at opdatere 'friendship' tabellen og returnere den opdaterede række
    const query =
      "UPDATE friendship SET status = $1 WHERE user_id1 = $2 AND user_id2 = $3 RETURNING *";
    const values = ["accepted", friendId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer den opdaterede række som JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at afvise en venneanmodning
export const rejectFriendRequest = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter venne-id'et fra URL-parametrene
    const { friendId } = req.params;
    // SQL-query til at slette en række fra 'friendship' tabellen og returnere den slettede række
    const query =
      "DELETE FROM friendship WHERE user_id1 = $1 AND user_id2 = $2 RETURNING *";
    const values = [friendId, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer den slettede række som JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at hente alle venner baseret på deres status (ventende, accepterede eller alle)
export const getFriends = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter venne-status fra URL-parametrene
    const { friendStatus } = req.params;
    let query;
    let values;

    // Afhængigt af venne-status, konstrueres en passende SQL-query og værdier
    if (friendStatus === "pending") {
      query =
        "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au JOIN friendship f ON au.user_id = f.user_id2 WHERE user_id1 = $1 AND status = $2;";
      values = [userId, "pending"];
    } else if (friendStatus === "accepted") {
      query = `
      SELECT
          CASE
              WHEN f.user_id1 = $1 THEN f.user_id2
              ELSE f.user_id1
          END AS user_id,
          u.username,
          u.profile_picture,
          f.status
      FROM
          friendship f
      JOIN
          app_user u ON (f.user_id1 = u.user_id OR f.user_id2 = u.user_id)
      WHERE
          (f.user_id1 = $1 OR f.user_id2 = $1)
          AND f.status = $2
          AND u.user_id != $1;
      `;
      values = [userId, "accepted"];
    } else if (friendStatus === "all") {
      query = `
      SELECT
          CASE
              WHEN f.user_id1 = $1 THEN f.user_id2
              ELSE f.user_id1
          END AS user_id,
          u.username,
          u.profile_picture,
          f.status
      FROM
          friendship f
      JOIN
          app_user u ON (f.user_id1 = u.user_id OR f.user_id2 = u.user_id)
      WHERE
          (f.user_id1 = $1 OR f.user_id2 = $1)
          AND u.user_id != $1;
      `;
      values = [userId];
    } else {
      // Hvis venne-status er ugyldig, sendes status 400 (ugyldig anmodning) og en fejlmeddelelse
      return res.status(400).json({ message: "Invalid friend status" });
    }

    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);

    // Logger resultatet til konsollen (kan fjernes i produktion)
    console.log(result.rows);

    // Sender status 200 (OK) og returnerer resultaterne som JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at fjerne en ven
export const removeFriend = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter venne-id'et fra URL-parametrene
    const { friendId } = req.params;
    // SQL-query til at slette en række fra 'friendship' tabellen baseret på bruger- og ven-id'er
    const query =
      "DELETE FROM friendship WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1) RETURNING *";
    const values = [userId, friendId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer den slettede række som JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at søge efter venner baseret på en søgeforespørgsel
export const searchFriends = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter søgeforespørgslen fra URL-parametrene
    const { searchQuery } = req.params;
    // SQL-query til at søge efter brugere, der matcher søgeforespørgslen
    const query =
      "SELECT au.user_id, au.username, au.profile_picture, f.status FROM app_user au LEFT JOIN friendship f ON au.user_id = f.user_id2 WHERE au.username ILIKE $1 AND au.user_id != $2;";
    const values = [`%${searchQuery}%`, userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer resultaterne som JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at hente alle venskabsstatusser for en bruger
export const getAllFriendshipStatuses = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // SQL-query til at hente alle venskabsstatusser baseret på brugerens id
    const query =
      "SELECT * FROM friendship WHERE user_id1 = $1 OR user_id2 = $1;";
    const values = [userId];
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, values);
    // Sender status 200 (OK) og returnerer resultaterne som JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};
