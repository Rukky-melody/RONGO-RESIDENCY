const { BrevoClient } = require('@getbrevo/brevo');

const sendWelcomeEmail = async (email, fullname) => {
    const client = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY,
        timeoutInSeconds: 60 // Increased timeout for slower network conditions
    });

    try {
        console.log(`Attempting to send Brevo email to: ${email}...`);
        const data = await client.transactionalEmails.sendTransacEmail({
            subject: "Welcome to the Rongo Art Foundation",
            htmlContent: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #3B5254;">
                    <h2 style="color: #3B5254;">Welcome, ${fullname}</h2>
                    <p>Thank you for joining the Rongo Art Foundation network.</p>
                    <p>We are dedicated to preserving heritage and empowering artistic excellence.</p>
                </div>
            `,
            textContent: `Welcome, ${fullname}. Thank you for joining the Rongo Art Foundation network. We are dedicated to preserving heritage and empowering artistic excellence.`,
            sender: { "name": "Rongo Art Foundation", "email": process.env.EMAIL_USER },
            replyTo: { "email": process.env.EMAIL_USER },
            to: [{ "email": email, "name": fullname }]
        });
        return data;
    } catch (error) {
        console.error('Brevo API Error:', error);
        throw error;
    }
};

module.exports = { sendWelcomeEmail };
