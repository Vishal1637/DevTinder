const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Please Login!" });
        }
        
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is required");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }
        res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = { userAuth };