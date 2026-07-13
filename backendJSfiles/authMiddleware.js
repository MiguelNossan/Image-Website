import jwt from "jsonwebtoken";
import { User } from "./models/user.js";

export const authMiddleware = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ 
            message: "No token"
        })
    }

    const jwToken = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            jwToken, 
            process.env.JWT_SECRET
        );
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).send({ 
                message: "User not found"
            })
        }

        req.user = user;
        next()
    } catch (err) {
        return res.status(401).send({ message: "Invalid token"})
    }
}