import jwt from "jsonwebtoken";

// Middleware funktion til at validere JWT
const validateJWT = (req, res, next) => {
    // Få token fra cookie
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        // Verifering af token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Sæt decoded userId på request'en
        req.userId = decoded.userId;
        // Fortsæt til næste funktion
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default validateJWT;