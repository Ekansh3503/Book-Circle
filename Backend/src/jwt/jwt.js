import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const jwtAuthMiddleware = ( req, res, next ) => {

    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).json({ error: 'Token Not found'})
    }
    const token = req.headers.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded
        next();

    } catch (error) {
        console.error("JWT Error", error);
        res.status(401).json({error: "Invalid token"});
    }
}
// Function to get user ID from token
const getUserIdFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}
// Fucntion to generate JWT token 
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '30d'})
}

export default {jwtAuthMiddleware, getUserIdFromToken, generateToken};