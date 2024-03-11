import pool from "../db";

export const fetchPostDetailsFromIDList = async (postIDList) => {
  try {
    // write sql query to fetch likes, comments, and shares for each post including the username and profile picture of the user who performed the action
    const query = `
      SELECT 
        p.post_id,
        p.content,
        p.img,
        p.post_date,
        u.username,
        u.profile_picture,
        COUNT(DISTINCT l.like_id) AS like_count,
        COUNT(DISTINCT c.comment_id) AS comment_count,
        COUNT(DISTINCT s.share_id) AS share_count
      FROM post p
      INNER JOIN app_user u ON p.user_id = u.user_id
      LEFT JOIN post_like l ON p.post_id = l.post_id
      LEFT JOIN comment c ON p.post_id = c.post_id
      LEFT JOIN share s ON p.post_id = s.post_id
      WHERE p.post_id = ANY($1::int[])
      GROUP BY p.post_id, u.username, u.profile_picture
      ORDER BY p.post_date DESC
    `;
  } catch (error) {
    throw new Error(error.message);
  }
};
