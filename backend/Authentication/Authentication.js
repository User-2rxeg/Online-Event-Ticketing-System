const jwt = require("jsonwebtoken");
const User = require("../models/User");
const error = require("../Authentication/error");

function auth(required = true) {
    return async (req, res, next) => {
        try {
            const header = req.headers.authorization || "";
            const token = header.startsWith("Bearer ") ? header.slice(7) : null;

            if (!token) {
                if (!required) return next();
                res.status(401);
                return next(new Error("Authentication required"));
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(payload.id);
            if (!user) {
                res.status(401);
                return next(new Error("Invalid token"));
            }
            req.user = user;
            next();
        } catch (err) {
            res.status(401);
            next(new Error("Invalid or expired token"));
        }
    };
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            return next(new Error("Authentication required"));
        }
        if (!roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error("Forbidden: insufficient role"));
        }
        next();
    };
}

module.exports = { auth, requireRole };