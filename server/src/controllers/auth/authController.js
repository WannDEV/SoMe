import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from '../../db';

export const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
        const values = [req.body.username, req.body.email, hashedPassword];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [req.body.email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};