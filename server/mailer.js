const nodemailer = require('nodemailer');
require('dotenv').config();

// --- DEBUGGING ---
console.log("--- DEBUGGING .env ---");
console.log("Gelezen EMAIL_USER:", process.env.EMAIL_USER);
console.log("Gelezen EMAIL_PASS:", process.env.EMAIL_PASS ? "******** (Wachtwoord is geladen)" : "Niet gevonden of leeg");
console.log("----------------------");

let transport;

async function initializeMailer() {
    console.log("--- Initializing Mailer ---");
    console.log("Found EMAIL_USER:", process.env.EMAIL_USER ? "Yes" : "No");
    console.log("Found EMAIL_PASS:", process.env.EMAIL_PASS ? "Yes" : "No");

    // Conditie: gebruik Gmail ALLEEN als BEIDE variabelen bestaan en niet leeg zijn.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log("Attempting to initialize Gmail transport...");
        transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log("✅ Gmail transport initialized.");
    } else {
        console.log("Gmail credentials not found. Initializing Ethereal transport...");
        try {
            const testAccount = await nodemailer.createTestAccount();
            transport = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log("✅ Ethereal transport initialized.");
        } catch (error) {
            console.error("❌ Failed to create Ethereal test account:", error);
        }
    }
}

const sendVerificationEmail = async (userEmail, token) => {
    if (!transport) {
        // Zorg ervoor dat de mailer geïnitialiseerd is voordat we verzenden.
        // Dit is een fallback voor het geval de eerste initialisatie mislukt.
        await initializeMailer();
        if (!transport) {
            console.error('❌ FATAL: Email transport could not be initialized.');
            return;
        }
    }

    const url = `http://localhost:5173/verify?token=${token}`;

    try {
        const info = await transport.sendMail({
            from: process.env.EMAIL_USER || '"Career Launch" <noreply@careerlaunch.com>',
            to: userEmail,
            subject: 'Verifieer je e-mailadres voor Career Launch',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #1e293b; text-align: center; margin-bottom: 20px;">🎉 Welkom bij Career Launch!</h1>
                        
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            Bedankt voor je registratie! Om je account te activeren en te kunnen inloggen, 
                            moet je eerst je e-mailadres verifiëren.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" 
                               style="background-color: #3884ff; color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 8px; font-weight: bold; 
                                      display: inline-block; font-size: 16px;">
                                ✅ Verifieer mijn e-mailadres
                            </a>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                            <strong>Let op:</strong> Deze link is 24 uur geldig. Als je deze registratie niet hebt uitgevoerd, 
                            kun je deze e-mail veilig negeren.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
                        
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            Career Launch - Je carrière begint hier
                        </p>
                    </div>
                </div>
            `
        });

        console.log('✅ Verification email sent successfully to:', userEmail);
        
        // Nodemailer.getTestMessageUrl() werkt alleen met een Ethereal account
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Ethereal preview URL:', nodemailer.getTestMessageUrl(info));
        }
        
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
    }
};

// Start de initialisatie direct wanneer de module geladen wordt.
initializeMailer();

module.exports = { sendVerificationEmail }; 