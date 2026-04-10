const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let cachedConn = null;

const connectDB = async () => {
    // If we have a cached connection, use it
    if (cachedConn && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection');
        return cachedConn;
    }

    let dbUri = process.env.MONGODB_URI;

    try {
        if (dbUri) {
            console.log(`Attempting to connect to MongoDB: ${dbUri.split('@')[1] || dbUri}`);
            cachedConn = await mongoose.connect(dbUri, { 
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10 // Recommended for serverless
            });
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return cachedConn;
        }
    } catch (error) {
        console.warn(`Failed to connect to provided MONGODB_URI: ${error.message}`);
        console.warn('Falling back to In-Memory MongoDB...');
    }

    try {
        // Only create MongoMemoryServer if we don't have one
        if (!mongoServer) {
            mongoServer = await MongoMemoryServer.create();
            dbUri = mongoServer.getUri();
        }
        
        cachedConn = await mongoose.connect(dbUri);
        console.log(`In-Memory MongoDB Connected: ${dbUri}`);
        return cachedConn;
    } catch (error) {
        console.error(`Critical Error: Could not connect to any database: ${error.message}`);
        // In serverless, we don't necessarily want to process.exit(1) 
        // as it might kill the lambda environment unnecessarily, but for critical init it's fine.
        throw error;
    }
};

const disconnectDB = async () => {
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connectDB, disconnectDB };
