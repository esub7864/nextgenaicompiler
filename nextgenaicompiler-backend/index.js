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
app.post("/runcode", runCode);
app.post("/register", register);
app.post("/login", login);
app.get("/validate", validate);
app.post("/subscribe", subscribe);
app.post("/auth/google", googleAuth);
app.get("/ping", (req, res) => res.send("hello"));

// connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to database", err);
});
