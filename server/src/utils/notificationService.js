// Importerer pool fra db-modulet
import pool from "../db";

// Funktion til at sende notifikationer til en liste af brugere
export async function sendNotifications(userIds, notificationType, message) {
  try {
    // Hvis der ikke er angivet bruger-IDs eller listen er tom, udskrives en advarsel og funktionen returnerer tidligt
    if (!userIds || userIds.length === 0) {
      console.warn("No user IDs provided for notification");
      return;
    }

    // Forbereder værdierne til at blive indsat i databasen som en batch-operation
    const values = userIds.map((userId) => [userId, notificationType, message]);
    // SQL-query til at indsætte notifikationer i databasen
    const query = `
      INSERT INTO notification (user_id, notification_type, notification_content)
      VALUES ($1, $2, $3)
    `;

    // Udfører batch-operationen med værdierne og venter på resultatet
    await pool.query(query, values);
    // Udskriver antallet af brugere, som notifikationerne er blevet sendt til
    console.log(`Notifications sent to ${userIds.length} users.`);
  } catch (error) {
    // Hvis der opstår en fejl, udskrives fejlmeddelelsen
    console.error("Error creating notifications:", error.message);
  }
}
