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

const sendReservationNotificationEmail = async (bedrijf, student, slot) => {
    if (!transport) {
        await initializeMailer();
        if (!transport) {
            console.error('❌ FATAL: Email transport could not be initialized for reservation email.');
            return;
        }
    }

    // Formatteer de datums netjes
    const eventDate = new Date(slot.starttijd).toLocaleDateString('nl-BE', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const startTime = new Date(slot.starttijd).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(slot.eindtijd).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });

    try {
        const info = await transport.sendMail({
            from: process.env.EMAIL_USER || '"Career Launch" <noreply@careerlaunch.com>',
            to: bedrijf.email,
            subject: `Nieuwe Speeddate Reservering: ${student.voornaam} ${student.naam}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9fafb;">
                    <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                        <h1 style="color: #1a202c; text-align: center;">Nieuwe Speeddate Reservering</h1>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                            Hallo ${bedrijf.naam},
                        </p>
                        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                            Een student heeft zojuist een speeddate met jullie gereserveerd. Hieronder vindt u de details.
                        </p>
                        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Details van de Reservering</h2>
                            <p style="font-size: 16px; color: #2d3748;"><strong>Student:</strong> ${student.voornaam} ${student.naam}</p>
                            <p style="font-size: 16px; color: #2d3748;"><strong>E-mail Student:</strong> <a href="mailto:${student.email}" style="color: #3884ff;">${student.email}</a></p>
                            <p style="font-size: 16px; color: #2d3748;"><strong>Datum:</strong> ${eventDate}</p>
                            <p style="font-size: 16px; color: #2d3748;"><strong>Tijdslot:</strong> ${startTime} - ${endTime}</p>
                            <p style="font-size: 16px; color: #2d3748;"><strong>Locatie:</strong> Lokaal ${bedrijf.lokaal} (${bedrijf.verdieping})</p>
                        </div>
                        <p style="color: #718096; font-size: 14px;">
                            Met vriendelijke groet,<br>
                            Het Career Launch Team
                        </p>
                    </div>
                </div>
            `
        });

        console.log('✅ Reservation notification email sent successfully to:', bedrijf.email);
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Ethereal preview URL:', nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error(`❌ Error sending reservation notification to ${bedrijf.email}:`, error);
    }
};

// Start de initialisatie direct wanneer de module geladen wordt.
initializeMailer();

module.exports = { sendVerificationEmail, sendReservationNotificationEmail }; 