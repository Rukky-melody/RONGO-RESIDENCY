require('dotenv').config();
const nodemailer = require('nodemailer');

const testTransporter = async () => {
    console.log('Testing email transporter with:', process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.verify();
        console.log('✅ Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the email server:', error);
    }
};

testTransporter();
