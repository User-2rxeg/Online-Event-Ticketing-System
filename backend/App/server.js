// backend/App/server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const error = require("../Authentication/error");

// load env from backend/.env (one level up from /App)
dotenv.config({ path: require("path").join(__dirname, "..", ".env") });

// DB
const connectDB = require("./Database");

// Routers (they’re one level up from /App)
const authRouter = require("../Routers/Authentication-Router");
const userRouter = require("../Routers/User-Router");
const eventRouter = require("../Routers/Event-Router");
const bookingRouter = require("../Routers/Booking-Router");

// Error handlers at backend/error.js
const { notFound, errorHandler } = require("../Authentication/error");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// connect DB
connectDB();

// mount
app.use("/api/v1", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

// errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
