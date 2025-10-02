const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        console.error('Profile edit error:', err);
        if (err.name === 'ValidationError') {
            res.status(422).json({ message: err.message });
        } else if (err.message.includes('Invalid Edit')) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
});

module.exports = profileRouter;