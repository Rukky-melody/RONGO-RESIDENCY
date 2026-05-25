const { sendWelcomeEmail } = require('../services/emailService');

const registerUser = async (req, res) => {
    console.log("--- New Request Received ---");
    try {
        const { fullname, email } = req.body;
        
        console.log("Step 1: Preparing Email...");
        
        // Step 3: Send the Email in the background (Fire and forget)
        sendWelcomeEmail(email, fullname).catch(error => {
            console.error("❌ Background Email Service Error:", error.message);
        });

        console.log("✅ Step 3: Email triggered in background.");
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({ success: true, redirectUrl: '/success.html' });
        }
        return res.redirect('/success.html');

    } catch (err) {
        console.log("❌ Database Error:", err.message);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        res.status(500).send("Database error: " + err.message);
    }
};

module.exports = { registerUser };
