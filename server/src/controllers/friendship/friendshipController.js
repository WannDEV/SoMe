import pool from '../../db';

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const query = 'INSERT INTO friendships (userID, friendID) VALUES ($1, $2) RETURNING *';
        const values = [userId, friendId];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const query = 'UPDATE friendships SET status = $1 WHERE user_id = $2 AND friend_id = $3 RETURNING *';
        const values = ['accepted', friendId, userId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        const query = 'DELETE FROM friendships WHERE user_id = $1 AND friend_id = $2 RETURNING *';
        const values = [userId, friendId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFriends = async (req, res) => {
    try {
        const userId = req.params.userId;
        const query = 'SELECT users.userId, users.username, users.profile_picture FROM friendships JOIN users ON friendships.friendID = users.userID WHERE userID = $1 AND status = $2';
        const values = [userId, 'accepted'];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        const query = 'DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1) RETURNING *';
        const values = [userId, friendId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
