const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    let dbUri = process.env.MONGODB_URI;

    try {
        if (dbUri) {
            console.log(`Attempting to connect to MongoDB: ${dbUri.split('@')[1] || dbUri}`);
            // Set a short timeout for the connection attempt so it doesn't hang too long
            await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return;
        }
    } catch (error) {
        console.warn(`Failed to connect to provided MONGODB_URI: ${error.message}`);
        console.warn('Falling back to In-Memory MongoDB...');
    }

    try {
        mongoServer = await MongoMemoryServer.create();
        dbUri = mongoServer.getUri();
        await mongoose.connect(dbUri);
        console.log(`In-Memory MongoDB Connected: ${dbUri}`);
    } catch (error) {
        console.error(`Critical Error: Could not connect to any database: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connectDB, disconnectDB };
