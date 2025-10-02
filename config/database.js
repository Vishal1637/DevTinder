const mongoose = require('mongoose');

const connectdb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is required");
        }
        await mongoose.connect(mongoUri);
        if (process.env.NODE_ENV !== 'production') {
            console.log("MongoDB connected successfully");
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error("Database connection error:", error.message);
        }
        throw error;
    }
};

module.exports = connectdb;