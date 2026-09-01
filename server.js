require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const cookieParser = require('cookie-parser');

const connectDB          = require('./config/db');
const seedAdmin          = require('./utils/seedAdmin');

// ── Existing routes ────────────────────────────────────────────
const subscriberRoutes   = require('./routes/subscriberRoutes');

// ── CMS routes ─────────────────────────────────────────────────
const adminAuthRoutes    = require('./routes/adminAuthRoutes');
const aboutRoutes        = require('./routes/aboutRoutes');
const teamRoutes         = require('./routes/teamRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const subscriberAdminRoutes = require('./routes/subscriberAdminRoutes');
const galleryRoutes      = require('./routes/galleryRoutes');

const app  = express();
const PORT = process.env.PORT || 2026;

console.log('--- Initializing Rongo Server ---');
console.log(`Port Configured: ${PORT}`);

// 1. Database Connection + Seed
connectDB().then(() => seedAdmin());

// 2. Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Routes — existing
app.use('/', subscriberRoutes);

// 4. Routes — CMS
app.use('/', adminAuthRoutes);
app.use('/', aboutRoutes);
app.use('/', teamRoutes);
app.use('/', announcementRoutes);
app.use('/', subscriberAdminRoutes);
app.use('/', galleryRoutes);

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred: ' + err.message });
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server live on port ${PORT}`));