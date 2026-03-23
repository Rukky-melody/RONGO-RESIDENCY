const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, fullname) => {
    return await resend.emails.send({
        // IMPORTANT: You MUST verify the domain you want to send from on the Resend dashboard.
        // If you don't have a verified domain on Resend, you can only send emails to yourself!
        from: 'Rongo Art Foundation <onboarding@resend.dev>', // Temporary testing email provided by Resend
        to: email, // If testing without a domain, this MUST be your own registered Resend email address
        subject: 'Welcome to the Rongo Art Foundation',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #3B5254;">
                <h2 style="color: #3B5254;">Welcome, ${fullname}</h2>
                <p>Thank you for joining the Rongo Art Foundation network.</p>
                <p>We are dedicated to preserving heritage and empowering artistic excellence.</p>
            </div>
        `
    });
};

module.exports = { sendWelcomeEmail };
