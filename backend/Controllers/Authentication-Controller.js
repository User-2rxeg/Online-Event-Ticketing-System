const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const error = require("../Authentication/error");

function sign(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, profilePicture, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            res.status(400);
            throw new Error("Email already registered");
        }
        const user = await User.create({ name, email, password, profilePicture, role });
        const token = sign(user);
        res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(401);
            throw new Error("Invalid credentials");
        }
        const ok = await user.comparePassword(password);
        if (!ok) {
            res.status(401);
            throw new Error("Invalid credentials");
        }
        const token = sign(user);
        res.json({ token, user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

// Simple “forget password” (demo): update by email
exports.forgetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        user.password = newPassword; // will be hashed by pre-save
        await user.save();
        res.json({ message: "Password updated" });
    } catch (err) {
        next(err);
    }
};
