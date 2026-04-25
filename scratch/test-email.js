require('dotenv').config();
const { sendWelcomeEmail } = require('../services/emailService');

const testEmail = async () => {
    const testRecipient = 'rongoartfoundation@gmail.com'; // Testing by sending to self
    const testName = 'Test User';

    console.log('--- Starting Email Test ---');
    console.log('Configured Sender:', process.env.EMAIL_USER);
    console.log('SMTP User:', process.env.SMTP_USER);

    try {
        const result = await sendWelcomeEmail(testRecipient, testName);
        console.log('Test successful! Message ID:', result.messageId);
    } catch (err) {
        console.error('Test failed!');
        console.error('Error Details:', err.message);
        if (err.response) {
            console.error('SMTP Response:', err.response);
        }
    }
};

testEmail();
