const app = require('../src/app');
const { connectDB } = require('../src/config/db');

// Vercel serverless function entry point
module.exports = async (req, res) => {
    try {
        // Ensure database is connected
        await connectDB();
        
        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('Vercel Entry Point Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error during initialization' });
    }
};
