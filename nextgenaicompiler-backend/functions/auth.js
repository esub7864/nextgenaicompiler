const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Subscription = require("../models/Subscription");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { email, password, confirm_password, pro_user = false } = req.body;

    if (!email || !password || !confirm_password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        password: hashedPassword,
        pro_user: Boolean(pro_user)
    });

    await user.save();

    const token = jwt.sign(
        { id: user._id, email: user.email, pro_user: user.pro_user },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ message: "Registered successfully", token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, pro_user: user.pro_user },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
};

async function validate(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ message: "Token is valid", user: decoded, status: true });
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token", status: false });
    }
}

const subscribe = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const existing = await Subscription.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already subscribed" });
        }

        const sub = new Subscription({ email });
        await sub.save();

        return res.json({ message: "Subscribed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = {
    register, login, validate, subscribe
};