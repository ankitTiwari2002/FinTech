require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB().then(async () => {
    // Automatically seed data if using in-memory database
    if (!process.env.MONGODB_URI) {
        console.log('Detected In-Memory DB. Running seeder internally...');
        const seedData = require('./seeder.js');
        await seedData();
    }
    
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
});
