const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Attempting to connect to MongoDB Atlas...');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ Cloud Connection Error:', err.message);
        // Removing process.exit(1) so the app stays alive and binds to the port,
        // allowing Render to show the server as 'Live' and display errors properly.
    }
};

module.exports = connectDB;
