import pool from "../../db";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const query = "SELECT * FROM notification WHERE userID = $1";
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.notificationId;
    const query =
      "UPDATE notification SET isRead = true WHERE notificationID = $1 AND userID = $2 RETURNING *";
    const result = await pool.query(query, [notificationId, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.notificationId;
    const query =
      "DELETE FROM notification WHERE notificationID = $1 AND userID = $2 RETURNING *";
    const result = await pool.query(query, [notificationId, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
