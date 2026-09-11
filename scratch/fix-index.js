require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    try {
        await db.collection('admins').dropIndex('username_1');
        console.log('Index username_1 dropped.');
    } catch(err) {
        console.log('Index error:', err.message);
    }
    process.exit(0);
}
fix();
