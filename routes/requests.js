const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request Already Exists!!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ message: "Connection request already exists" });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid request ID format" });
        }

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = requestRouter;