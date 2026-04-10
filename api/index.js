const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const seedData = require('../seeder');

// Vercel serverless function entry point
module.exports = async (req, res) => {
    try {
        // Ensure database is connected
        await connectDB();

        // Automatically seed data if using in-memory database
        if (!process.env.MONGODB_URI) {
            await seedData();
        }
        
        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('Vercel Entry Point Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error during initialization' });
    }
};
