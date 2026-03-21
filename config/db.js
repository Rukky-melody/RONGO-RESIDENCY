const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Rongo Cloud Database');
    } catch (err) {
        console.error('Cloud Connection Error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
