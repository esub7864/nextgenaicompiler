const express = require("express");
const cors = require("cors");
const { connectDB } = require("./connections");

const { runCode } = require("./functions/runcode");
const { register, login, validate,subscribe } = require("./functions/auth");
const { googleAuth } = require("./functions/googleAuth");

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// routes
app.post("/api/runcode", runCode);
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/validate", validate);
app.post("/api/subscribe", subscribe);
app.post("/api/auth/google", googleAuth);
app.get("/api/ping", (req, res) => res.send("hello"));

// connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to database", err);
});
