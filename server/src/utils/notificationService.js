import pool from "../db"; // Replace with your database connection pool

export async function sendNotifications(userIds, notificationType, message) {
  try {
    if (!userIds || userIds.length === 0) {
      console.warn("No user IDs provided for notification");
      return;
    }

    const values = userIds.map((userId) => [userId, notificationType, message]);
    const query = `
      INSERT INTO notification (user_id, notification_type, notification_content)
      VALUES ($1, $2, $3)
    `;

    await pool.query(query, values);
    console.log(`Notifications sent to ${userIds.length} users.`);
  } catch (error) {
    console.error("Error creating notifications:", error.message);
  }
}
