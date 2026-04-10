require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Record = require('./src/models/Record');
const { connectDB, disconnectDB } = require('./src/config/db');

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Record.deleteMany();

        console.log('Seeding Initial Data...');

        // Fixed IDs for consistency across restarts
        const ADMIN_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
        const ANALYST_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439012');
        const VIEWER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439013');

        // Create Users manually to ensure hooks run or hash correctly
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        await User.insertMany([
            { _id: ADMIN_ID, name: 'Admin User', email: 'admin@fintech.com', password, role: 'admin' },
            { _id: ANALYST_ID, name: 'Analyst User', email: 'analyst@fintech.com', password, role: 'analyst' },
            { _id: VIEWER_ID, name: 'Viewer User', email: 'viewer@fintech.com', password, role: 'viewer' }
        ]);

        console.log('Users created with fixed IDs.');

        // Create some Records for Admin with fixed IDs
        await Record.insertMany([
            { _id: new mongoose.Types.ObjectId('6616e0b7f80a2b0015c8e3a1'), amount: 5000, type: 'income', category: 'Salary', notes: 'Monthly salary', user_id: ADMIN_ID },
            { _id: new mongoose.Types.ObjectId('6616e0b7f80a2b0015c8e3a2'), amount: 150, type: 'expense', category: 'Groceries', notes: 'Walmart', user_id: ADMIN_ID, date: new Date(Date.now() - 86400000) },
            { _id: new mongoose.Types.ObjectId('6616e0b7f80a2b0015c8e3a3'), amount: 50, type: 'expense', category: 'Entertainment', notes: 'Movie tickets', user_id: ADMIN_ID, date: new Date(Date.now() - 86400000 * 2) },
            { _id: new mongoose.Types.ObjectId('6616e0b7f80a2b0015c8e3a4'), amount: 1200, type: 'income', category: 'Freelance', notes: 'Web project', user_id: ADMIN_ID, date: new Date(Date.now() - 86400000 * 5) },
            { _id: new mongoose.Types.ObjectId('6616e0b7f80a2b0015c8e3a5'), amount: 200, type: 'expense', category: 'Utilities', notes: 'Electricity bill', user_id: ADMIN_ID, date: new Date(Date.now() - 86400000 * 6) }
        ]);

        console.log('Sample financial records created.');

        if (require.main === module) {
            await disconnectDB();
            console.log('Data Imported!');
            process.exit();
        } else {
            console.log('Data Imported internally!');
        }
    } catch (error) {
        console.error('Seeder Error:', error);
        if (require.main === module) process.exit(1);
    }
};

if (require.main === module) {
    seedData();
}

module.exports = seedData;
