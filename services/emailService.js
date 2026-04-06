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
                <div style="background-color: #F9F7F2; padding: 40px 20px; margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px; border-top: 4px solid #3B5254; box-shadow: 0 4px 15px rgba(0,0,0,0.05); color: #333333; line-height: 1.6;">
                        
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #3B5254; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">RONGO ART FOUNDATION</h1>
                            <hr style="border: none; border-bottom: 1px solid #eeeeee; margin-top: 20px;" />
                        </div>
                        
                        <h2 style="color: #1A1A1A; font-size: 20px; font-weight: normal; margin-top: 0;">Dear ${fullname},</h2>
                        
                        <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">Welcome and thank you for joining the Rongo Art Foundation community.</p>
                        
                        <p style="font-size: 16px; color: #555555; margin-bottom: 20px; text-align: justify;">
                            We exist to equip emerging artists in Nigeria with the structural support, legal literacy, and digital protection required for sustainable growth. 
                            By subscribing, you'll be the first to receive updates on our flagship programs like the <strong>Rongo Artist Residency</strong>, the <strong>Benin Arts and Books Festival</strong>, and other exclusive creative opportunities.
                        </p>
                        
                        <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">We look forward to an inspiring journey together in preserving our heritage while empowering artistic excellence.</p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
                            <p style="font-size: 14px; color: #3B5254; font-weight: bold; margin: 0; letter-spacing: 1px;">RONGO ART FOUNDATION</p>
                            <p style="font-size: 12px; color: #888888; margin-top: 5px; font-style: italic;">Rooted in heritage. Focused on structure. Committed to the future.</p>
                        </div>
                    </div>
                </div>
            `,
            textContent: `Dear ${fullname},\n\nWelcome and thank you for joining the Rongo Art Foundation community.\n\nWe exist to equip emerging artists in Nigeria with the structural support, legal literacy, and digital protection required for sustainable growth. By subscribing, you'll be the first to receive updates on our flagship programs like the Rongo Artist Residency, the Benin Arts and Books Festival, and other exclusive creative opportunities.\n\nWe look forward to an inspiring journey together in preserving our heritage while empowering artistic excellence.\n\nBest regards,\nRongo Art Foundation\nRooted in heritage. Focused on structure. Committed to the future.`,
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
