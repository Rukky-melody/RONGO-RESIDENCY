const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (email, fullname) => {
    // 1. Create a transporter using Brevo SMTP details
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log(`Attempting to send email via SMTP to: ${email}...`);
        
        const mailOptions = {
            from: `"Rongo Art Foundation" <${process.env.EMAIL_USER}>`,
            replyTo: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to the Rongo Art Foundation",
            text: `Dear ${fullname},\n\nWelcome and thank you for joining the Rongo Art Foundation community.\n\nWe exist to equip emerging artists in Nigeria with the structural support, legal literacy, and digital protection required for sustainable growth. By subscribing, you'll be the first to receive updates on our flagship programs like the Rongo Artist Residency, the Benin Arts and Books Festival, and other exclusive creative opportunities.\n\nWe look forward to an inspiring journey together in preserving our heritage while empowering artistic excellence.\n\nBest regards,\nRongo Art Foundation\nRooted in heritage. Focused on structure. Committed to the future.\n\nP.S. To ensure our future updates go straight to your primary inbox, please reply "Hello" to this email or add us to your contacts!`,
            html: `
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
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #f0f4f4; border-radius: 4px; text-align: center;">
                            <p style="font-size: 13px; color: #444; margin: 0;">
                                <strong>P.S.</strong> To ensure our future updates go straight to your primary inbox, please reply <em>"Hello"</em> to this email or add us to your contacts!
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error;
    }
};

const addContactToBrevo = async (email, fullname) => {
    // We split the fullname to attempt to get a FIRSTNAME and LASTNAME
    const nameParts = fullname.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
        console.log(`Attempting to add ${email} to Brevo Contacts List...`);
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email,
                attributes: {
                    FIRSTNAME: firstName,
                    LASTNAME: lastName
                }
            })
        });

        if (response.ok) {
            console.log("✅ Successfully added to Brevo Contacts.");
        } else {
            const errorData = await response.json();
            // Code 'duplicate_parameter' means they are already in the contacts list!
            if (errorData.code === 'duplicate_parameter') {
                console.log("ℹ️ Contact already exists in Brevo Contacts List.");
            } else {
                console.error("❌ Failed to add to Brevo Contacts:", errorData);
            }
        }
    } catch (err) {
        console.error("❌ Network error when adding to Brevo:", err.message);
    }
};

module.exports = { sendWelcomeEmail, addContactToBrevo };
