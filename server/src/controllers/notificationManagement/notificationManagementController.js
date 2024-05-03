// Importerer 'pool' fra db/index.js, som sandsynligvis er en databaseforbindelse
import pool from "../../db/index.js";

// Funktion til at hente alle notifikationer for en bruger
export const getNotifications = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // SQL-query til at hente alle notifikationer for en bruger baseret på brugerens id
    const query = "SELECT * FROM notification WHERE user_id = $1";
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, [userId]);
    // Sender status 200 (OK) og returnerer notifikationerne som JSON
    res.status(200).json(result.rows);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at markere en notifikation som læst
export const markNotificationAsRead = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter notifikations-id'et fra URL-parametrene
    const notificationId = req.params.notificationId;
    // SQL-query til at opdatere 'notification' tabellen og markere notifikationen som læst
    const query =
      "UPDATE notification SET is_read = true WHERE notification_id = $1 AND user_id = $2 RETURNING *";
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, [notificationId, userId]);
    // Hvis der ikke findes nogen notifikation med det givne id, returneres status 404 (ikke fundet)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    // Sender status 200 (OK) og returnerer den opdaterede notifikation som JSON
    res.status(200).json(result.rows[0]);
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};

// Funktion til at slette en notifikation
export const deleteNotification = async (req, res) => {
  try {
    // Henter brugerens id fra anmodningen
    const userId = req.userId;
    // Henter notifikations-id'et fra URL-parametrene
    const notificationId = req.params.notificationId;
    // SQL-query til at slette en notifikation baseret på brugerens id og notifikations-id
    const query =
      "DELETE FROM notification WHERE notification_id = $1 AND user_id = $2 RETURNING *";
    // Udfører query'en og venter på resultatet
    const result = await pool.query(query, [notificationId, userId]);
    // Hvis der ikke findes nogen notifikation med det givne id, returneres status 404 (ikke fundet)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    // Sender status 200 (OK) og returnerer en succesmeddelelse som JSON
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    // Hvis der opstår en fejl, sendes status 500 (intern serverfejl) og fejlmeddelelsen som JSON
    res.status(500).json({ message: error.message });
  }
};
