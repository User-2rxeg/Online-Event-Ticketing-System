
const error = require("../Authentication/error");
const mongoose = require("mongoose");

module.exports = async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not set");
        process.exit(1);
    }
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};
























// const mongoose = require('mongoose');
//
// const connectDB = async () => {
//     try {
//         // Connection options for better performance and stability
//         const options = {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             // Automatically create indexes defined in schemas
//             autoIndex: true,
//             // Use the new Server Discover and Monitoring engine
//             serverSelectionTimeoutMS: 5000,
//             // Keep alive
//             socketTimeoutMS: 45000,
//             // Connection pool size
//             maxPoolSize: 10,
//             minPoolSize: 2,
//         };
//
//         // Get MongoDB URI from environment or use local
//         const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event_ticketing';
//
//         // Connect to MongoDB
//         const conn = await mongoose.connect(mongoUri, options);
//
//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`.green.bold);
//         console.log(`📁 Database: ${conn.connection.name}`.cyan);
//
//         // Handle connection events
//         mongoose.connection.on('error', (err) => {
//             console.error(`❌ MongoDB connection error: ${err}`.red.bold);
//         });
//
//         mongoose.connection.on('disconnected', () => {
//             console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...'.yellow);
//         });
//
//         mongoose.connection.on('reconnected', () => {
//             console.log('✅ MongoDB reconnected'.green);
//         });
//
//         // Graceful shutdown
//         process.on('SIGINT', async () => {
//             await mongoose.connection.close();
//             console.log('📴 MongoDB connection closed through app termination'.yellow);
//             process.exit(0);
//         });
//
//         return conn;
//     } catch (error) {
//         console.error(`❌ Error: ${error.message}`.red.bold);
//         // Exit process with failure
//         process.exit(1);
//     }
// };
//
// module.exports = connectDB;