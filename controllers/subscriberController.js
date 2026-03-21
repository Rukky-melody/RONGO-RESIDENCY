const Subscriber = require('../models/Subscriber');
const { sendWelcomeEmail } = require('../services/emailService');

const registerUser = async (req, res) => {
    console.log("--- New Request Received ---");
    try {
        const { fullname, email } = req.body;
        
        // Save to MongoDB
        const newSubscriber = new Subscriber({ fullname, email });
        await newSubscriber.save();
        console.log("✅ Step 1: User saved to Atlas");

        console.log("Step 2: Preparing Email...");
        
        // Step 3: Send the Email
        try {
            const info = await sendWelcomeEmail(email, fullname);
            console.log("✅ Step 3: Email sent!", info.response);
            res.send(`<h2>Success! Welcome email sent to ${email}.</h2><a href="/">Return Home</a>`);
        } catch (error) {
            console.log("❌ Nodemailer Error:", error.message);
            // Even if mail fails, the user is already saved in the DB
            return res.status(500).send("Registration saved, but welcome email failed: " + error.message);
        }

    } catch (err) {
        console.log("❌ Database Error or Duplicate Email:", err.message);
        res.status(500).send("Database error: " + err.message);
    }
};

module.exports = { registerUser };
