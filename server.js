require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();
app.use(cors()); // Allow all origins for now, can be restricted later
const PORT = process.env.PORT || 2026;

console.log('--- Initializing Rongo Server ---');
console.log(`Port Configured: ${PORT}`);

// 1. Database Connection
connectDB();

// 2. Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Routes
app.use('/', subscriberRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).send('An unexpected error occurred: ' + err.message);
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));