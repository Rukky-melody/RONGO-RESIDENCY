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
        process.exit(1); // Required for Render to report the failure
    }
};

module.exports = connectDB;
