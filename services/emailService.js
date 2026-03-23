const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrades later with STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            // .replace(/\s+/g, '') ensures spaces in the App Password don't break the login
            pass: process.env.EMAIL_PASS.replace(/\s+/g, '') 
        },
        connectionTimeout: 10000, // fail fast instead of hanging the UI
    });
};

const sendWelcomeEmail = async (email, fullname) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Rongo Art Foundation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to the Rongo Art Foundation',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #3B5254;">
                <h2 style="color: #3B5254;">Welcome, ${fullname}</h2>
                <p>Thank you for joining the Rongo Art Foundation network.</p>
                <p>We are dedicated to preserving heritage and empowering artistic excellence.</p>
            </div>
        `
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

module.exports = { sendWelcomeEmail };
