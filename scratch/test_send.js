require('dotenv').config();
const { sendWelcomeEmail } = require('../services/emailService');

const testSending = async () => {
    try {
        console.log('Sending test email...');
        const info = await sendWelcomeEmail('test-delivery@mailinator.com', 'Test User');
        console.log('Successfully sent! Message ID:', info.messageId);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

testSending();
