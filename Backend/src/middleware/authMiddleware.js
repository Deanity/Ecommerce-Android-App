import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        next(); 
        } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: "Tidak ada token, akses ditolak" });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Akses hanya untuk admin" });
    }
};
