const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

const googleAuth = async (req, res) => {
    try {
        const { token, pro_user = false } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await bcrypt.hash("google-oauth", 10);

            const user = new User({
                email,
                password: hashedPassword,
                pro_user: Boolean(pro_user)
            });

            await user.save();
        }
        const servertoken = jwt.sign(
            { id: user._id, email: user.email, pro_user: user.pro_user },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).json({ message: "Registered successfully", servertoken });

    } catch (error) {
        res.status(500).json({ message: "Authentication failed" });
    }
};

module.exports = { googleAuth };
