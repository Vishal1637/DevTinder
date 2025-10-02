require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/database");

const app = express();

app.use(cors({ 
    origin: [
        'https://devtinder-frontend-k9vaogdux-devlopertinders-projects.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// JSON parsing with error handling
app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({ message: 'Invalid JSON payload' });
            return;
        }
    }
}));
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

// Connect to database
connectdb()
    .then(() => {
        console.log("Database connection is successful");
    })
    .catch((err) => {
        console.error("Can't connect to the database", err);
    });

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is successfully started at http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;