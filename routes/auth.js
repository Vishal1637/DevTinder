const express = require("express");
const bcrypt = require("bcrypt");
const { validatesSignUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validatesSignUpData(req);
        const { lastName, emailId, password, firstName } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();
        res.json({ message: "User saved successfully", user: savedUser });
    } catch (err) {
        const statusCode = err.name === 'ValidationError' ? 400 : 500;
        res.status(statusCode).json({ message: err.message });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        
        // Validate input types to prevent NoSQL injection
        if (typeof emailId !== 'string' || typeof password !== 'string') {
            throw new Error("Invalid input format");
        }
        
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Email id is not present in the DB");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.json({ message: "Login successful", user });
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        const statusCode = err.message.includes('credentials') ? 401 : 500;
        res.status(statusCode).json({ message: err.message });
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.json({ message: "Logout successfully" });
});

module.exports = authRouter;