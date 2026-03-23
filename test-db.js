require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const testDb = async () => {
    try {
        fs.writeFileSync('error.log', 'Starting connection attempt...\n');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        fs.appendFileSync('error.log', 'Connected successfully!\n');
        console.log('Connected!');
        process.exit(0);
    } catch (e) {
        fs.appendFileSync('error.log', 'Connection Error: ' + e.message + '\n' + e.stack);
        console.error('Connection Error:', e);
        process.exit(1);
    }
};

testDb();
