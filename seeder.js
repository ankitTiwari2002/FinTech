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

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@fintech.com', password, role: 'admin' },
            { name: 'Analyst User', email: 'analyst@fintech.com', password, role: 'analyst' },
            { name: 'Viewer User', email: 'viewer@fintech.com', password, role: 'viewer' }
        ]);

        console.log('Users created:');
        console.log('- admin@fintech.com / password123 (Admin)');
        console.log('- analyst@fintech.com / password123 (Analyst)');
        console.log('- viewer@fintech.com / password123 (Viewer)');

        // Create some Records for Admin
        const adminId = users[0]._id;
        
        await Record.insertMany([
            { amount: 5000, type: 'income', category: 'Salary', notes: 'Monthly salary', user_id: adminId },
            { amount: 150, type: 'expense', category: 'Groceries', notes: 'Walmart', user_id: adminId, date: new Date(Date.now() - 86400000) },
            { amount: 50, type: 'expense', category: 'Entertainment', notes: 'Movie tickets', user_id: adminId, date: new Date(Date.now() - 86400000 * 2) },
            { amount: 1200, type: 'income', category: 'Freelance', notes: 'Web project', user_id: adminId, date: new Date(Date.now() - 86400000 * 5) },
            { amount: 200, type: 'expense', category: 'Utilities', notes: 'Electricity bill', user_id: adminId, date: new Date(Date.now() - 86400000 * 6) }
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
