const express = require('express');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { 
  sendVerificationEmail, 
  sendReservationNotificationEmail,
  sendReservationStatusUpdateEmail,
  sendAlternativeProposalEmail,
  sendAlternativeResponseEmail,
  sendCancellationNotificationEmail
} = require('./mailer');
const jwt = require('jsonwebtoken');

// admin routes importeren 
const adminLogin = require('./routes/adminLogin');           // POST /api/admin/login
const adminProfile = require('./routes/adminProfile');       // GET /api/admin/me, PUT /api/admin/update
const adminProtected = require('./routes/adminProtected');   // GET /api/admin/dashboard
const adminRoutes = require('./routes/admins');               // GET/POST/DELETE /api/admin/admins
const bedrijvenRoutes = require('./routes/bedrijven');       // GET /api/admin/bedrijven
const studentenRoutes = require('./routes/studenten');       // GET /api/admin/studenten
const speeddatesRoutes = require('./routes/speeddates');     // GET/POST/PUT /api/admin/speeddates
const statistiekenRoutes = require('./routes/stats');        // GET /api/admin/stats

// Publieke routes
const publicBedrijvenRoutes = require('./routes/publicBedrijven');

// --- START CONFIGURATIE VOOR AUTOMATISCHE TOEWIJZING ---

// Definieer hier de beschikbare lokalen en hun verdieping.
const BESCHIKBARE_LOCATIES = [
  { lokaal: 'Aula 1', verdieping: 'Gelijkvloers' },
  { lokaal: 'Aula 2', verdieping: 'Gelijkvloers' },
  { lokaal: 'Aula 3', verdieping: 'Gelijkvloers' },
  { lokaal: 'Aula 4', verdieping: 'Gelijkvloers' },
  { lokaal: 'Aula 5', verdieping: 'Eerste verdieping' },
  { lokaal: 'Aula 6', verdieping: 'Eerste verdieping' },
  { lokaal: 'Aula 7', verdieping: 'Eerste verdieping' },
  { lokaal: 'Aula 8', verdieping: 'Eerste verdieping' },
];

// De vaste datum voor het speeddate-evenement.
const EVENEMENT_DATUM = '2024-11-28';

// Middleware to get user ID from request, assuming you have a way to authenticate
// and add user info to the request object (e.g., using JWT).
// For now, we'll assume a user ID is passed in the request body or params.
const getBedrijfId = (req) => {
  // This is a placeholder. In a real app, you would get this from a decoded JWT token.
  // For example: req.user.id
  // We'll use a hardcoded ID or one from the body for now.
  return req.body.bedrijf_id || req.params.id || req.user?.bedrijf_id;
};

// --- EINDE CONFIGURATIE ---

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;


// admin route begin
app.use('/api/admin', adminLogin);
app.use('/api/admin', adminProfile);
app.use('/api/admin', adminProtected);
app.use('/api/admin', adminRoutes);        // bevat adminbeheer

app.use('/api/admin', bedrijvenRoutes);

app.use('/api/admin', studentenRoutes);
app.use('/api/admin', speeddatesRoutes);
app.use('/api/admin', statistiekenRoutes);
// admin routes eind

// Publieke routes
app.use('/api/bedrijven', publicBedrijvenRoutes);

// === Initialisatie bedrijven-tabel verwijderd ===

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLaunch API is running' });
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    const { gebruikersnaam, wachtwoord } = req.body;
    console.log("Loginpoging voor:", gebruikersnaam);

    if (!gebruikersnaam || !wachtwoord) {
        return res.status(400).json({ message: 'Gebruikersnaam en wachtwoord zijn verplicht' });
    }

    try {
        // Probeer eerst in de 'gebruikers' tabel te vinden (via gebruikersnaam OF email)
        let [userRows] = await db.promise().query(
            "SELECT * FROM gebruikers WHERE gebruikersnaam = ? OR email = ?", 
            [gebruikersnaam, gebruikersnaam]
        );
        let userType = 'student';
        let user = userRows[0];
        
        console.log(`Zoeken naar gebruiker '${gebruikersnaam}' in gebruikers tabel, gevonden:`, userRows.length);
        
        // Als niet in 'gebruikers', probeer in 'bedrijven'
        if (userRows.length === 0) {
            let [companyRows] = await db.promise().query(
                "SELECT * FROM bedrijven WHERE gebruikersnaam = ? OR email = ?", 
                [gebruikersnaam, gebruikersnaam]
            );
            console.log(`Zoeken naar gebruiker '${gebruikersnaam}' in bedrijven tabel, gevonden:`, companyRows.length);
            if (companyRows.length > 0) {
                user = companyRows[0];
                userType = 'bedrijf';
            }
        }

        if (!user) {
            console.log("Gebruiker niet gevonden.");
            return res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }

        // Bepaal het juiste ID veld
        const idColumn = userType === 'student' ? 'gebruiker_id' : 'bedrijf_id';
        const userId = user[idColumn];

        console.log("Gebruiker gevonden:", {
            [idColumn]: userId,
            gebruikersnaam: user.gebruikersnaam,
            email: user.email,
            is_verified: user.is_verified,
            type: userType
        });

    if (!user.is_verified) {
            console.log("Login mislukt: gebruiker is niet geverifieerd.");
            return res.status(401).json({ message: 'Account is niet geverifieerd. Controleer uw e-mail.' });
        }

        // Log het wachtwoord dat wordt vergeleken (alleen voor debugging)
        console.log("Vergelijk wachtwoord met hash:", user.wachtwoord.substring(0, 10) + "...");
        
        const isMatch = await bcrypt.compare(wachtwoord, user.wachtwoord);
        console.log("Wachtwoord match:", isMatch);

        if (isMatch) {
            // Bouw expliciet het user object voor de frontend met gebruiker_id
            const userForFrontend = {
                gebruiker_id: userId, // Gebruik consistent gebruiker_id
                gebruikersnaam: user.gebruikersnaam,
                email: user.email,
                voornaam: user.voornaam,
                naam: user.naam,
                opleiding: user.opleiding,
                opleiding_jaar: user.opleiding_jaar,
                is_verified: user.is_verified,
                type: userType
            };
            const token = jwt.sign(
                { 
                    id: userId, 
                    gebruikersnaam: user.gebruikersnaam, 
                    type: userType 
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            console.log("Login succesvol, stuur response:", { token: "***", user: userForFrontend });
            res.json({ token, user: userForFrontend });
        } else {
            console.log("Login mislukt: ongeldig wachtwoord.");
            res.status(401).json({ message: 'Ongeldige inloggegevens' });
        }
    } catch (error) {
        console.error("Serverfout bij inloggen:", error);
        res.status(500).json({ message: 'Serverfout' });
  }
});

// Test database connection and get structure
app.get('/api/test', async (req, res) => {
  try {
    // Test connection
    const [connectionResult] = await db.promise().query('SELECT 1');
    console.log('Database connection test result:', connectionResult);

    // Get table structure
    const [tables] = await db.promise().query('SHOW TABLES');
    console.log('Available tables:', tables);

    // Get gebruikers table structure
    const [gebruikersStructure] = await db.promise().query('DESCRIBE gebruikers');
    console.log('Gebruikers table structure:', gebruikersStructure);

    res.json({ 
      message: 'Database connection successful',
      tables,
      gebruikersStructure
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      error: 'Database error', 
      details: err.message,
      sqlMessage: err.sqlMessage
    });
  }
});

// Get database structure
app.get('/api/structure', (req, res) => {
  db.query('SHOW TABLES', (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    // Get structure of each table
    const tablePromises = tables.map(table => {
      const tableName = Object.values(table)[0];
      return new Promise((resolve, reject) => {
        db.query(`DESCRIBE ${tableName}`, (err, structure) => {
          if (err) reject(err);
          resolve({ table: tableName, structure });
        });
      });
    });

    Promise.all(tablePromises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: 'Error getting table structures', details: err.message }));
  });
});

// Genereer tijdsloten van 10 min tussen 10:00-13:00 en 14:00-18:00
const generateTimeslots = (dateStr) => {
  const slots = [];
  // 10:00 tot 18:00, elke 10 minuten
  for (let hour = 10; hour < 18; hour++) {
    for (let min = 0; min < 60; min += 10) {
      // Pauzes overslaan:
      const isPauze1 = (hour === 11 && min >= 20 && min < 40);
      const isLunch = (hour === 13);
      const isPauze2 = (hour === 16 && min >= 20 && min < 40);
      if (isPauze1 || isLunch || isPauze2) continue;

      const starttijd = `${dateStr} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
      const eindMin = min + 10;
      let eindHour = hour;
      let eindMinute = eindMin;
      if (eindMin === 60) {
        eindHour = hour + 1;
        eindMinute = 0;
      }
      const eindtijd = `${dateStr} ${String(eindHour).padStart(2, '0')}:${String(eindMinute).padStart(2, '0')}:00`;
      slots.push({ starttijd, eindtijd });
    }
  }
  return slots;
};

// Functie om tijdsloten aan te maken voor een bedrijf
async function createTimeslotsForBedrijf(bedrijfId, dateStr) {
  try {
    const slots = generateTimeslots(dateStr);
    for (const slot of slots) {
      await db.promise().query(
        'INSERT INTO speeddates (bedrijf_id, starttijd, eindtijd, is_bezet) VALUES (?, ?, ?, 0)',
        [bedrijfId, slot.starttijd, slot.eindtijd]
      );
    }
    console.log(`Tijdsloten toegevoegd voor bedrijf_id: ${bedrijfId}`);
    return true;
  } catch (err) {
    console.error(`Fout bij toevoegen tijdsloten voor bedrijf ${bedrijfId}:`, err);
    return false;
  }
}

// Route to handle email confirmation
app.get('/api/confirm/:token', async (req, res) => {
    const { token } = req.params;
    console.log("=== VERIFICATIE START ===");
    console.log("Verificatie-token ontvangen:", token);

    if (!token) {
        console.log("❌ Geen token ontvangen");
        return res.status(400).json({ 
            status: 'error',
            message: 'Geen verificatietoken ontvangen.',
            verified: false 
        });
    }

    try {
        // Eerst zoeken in 'gebruikers' tabel
        console.log("🔍 Zoeken in gebruikers tabel...");
        let [userRows] = await db.promise().query("SELECT * FROM gebruikers WHERE verification_token = ?", [token]);
        let tableName = 'gebruikers';
        let idColumn = 'gebruiker_id'; // Altijd gebruiker_id voor gebruikers

        console.log(`Gebruikers gevonden: ${userRows.length}`);

        // Als niet gevonden in 'gebruikers', zoek in 'bedrijven'
        if (userRows.length === 0) {
            console.log("🔍 Zoeken in bedrijven tabel...");
            [userRows] = await db.promise().query("SELECT * FROM bedrijven WHERE verification_token = ?", [token]);
            tableName = 'bedrijven';
            idColumn = 'bedrijf_id'; // Altijd bedrijf_id voor bedrijven
            console.log(`Bedrijven gevonden: ${userRows.length}`);
        }

        if (userRows.length > 0) {
            const user = userRows[0];
            const userId = user[idColumn];
            console.log(`✅ gebruiker gevonden:`, user);

            // Check of gebruiker al geverifieerd is
            if (user.is_verified === 1) {
                console.log(`✅ gebruiker is al geverifieerd`);
                return res.status(200).json({ 
                    status: 'already_verified',
                    message: "Je account is al geverifieerd. Je kunt nu inloggen.",
                    verified: true 
                });
            }

            // Check of token al is gebruikt (NULL)
            if (user.verification_token === null) {
                console.log(`✅ gebruiker heeft geen actieve token (al gebruikt)`);
                return res.status(200).json({ 
                    status: 'token_used',
                    message: "Deze verificatielink is al gebruikt. Je account is geverifieerd.",
                    verified: true 
                });
            }

            // Update de status naar geverifieerd
            console.log(`🔄 Updaten van ${tableName} met ${idColumn} ${userId}...`);
            await db.promise().query(`UPDATE ${tableName} SET is_verified = 1, verification_token = NULL WHERE ${idColumn} = ?`, [userId]);
            console.log(`✅ Update query uitgevoerd voor ${tableName} met ${idColumn} ${userId}`);

            // Verifieer de update met een SELECT query
            const [updatedRows] = await db.promise().query(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`, [userId]);
            console.log(`✅ Na update: gebruiker-status:`, updatedRows[0]);

            console.log("=== VERIFICATIE SUCCESVOL ===");
            return res.status(200).json({ 
                status: 'success',
                message: 'E-mailadres succesvol geverifieerd! U kunt nu inloggen.',
                verified: true,
                redirect: '/login'
            });
        } else {
            // Token niet gevonden
            console.log("❌ Token niet gevonden in database");
            console.log("=== VERIFICATIE MISLUKT ===");
            return res.status(400).json({ 
                status: 'invalid_token',
                message: 'Deze verificatielink is niet meer geldig. Als je je account nog niet hebt geverifieerd, registreer je opnieuw.',
                verified: false 
            });
        }
    } catch (error) {
        console.error('❌ Fout bij e-mailverificatie:', error);
        console.log("=== VERIFICATIE ERROR ===");
        return res.status(500).json({ 
            status: 'server_error',
            message: 'Er is een serverfout opgetreden bij het verifiëren van uw e-mailadres.',
            details: error.message 
        });
  }
});

// Student and Company Registration
app.post('/api/register', async (req, res) => {
  const { type, ...userData } = req.body;
  const verificationToken = crypto.randomBytes(32).toString('hex');

  if (type === 'student') {
    try {
      const { voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbanden, linkedin } = userData;
      const dienstverbandenStr = dienstverbanden ? JSON.stringify(dienstverbanden) : null;
      const opleidingJaarValue = opleiding_jaar === '' ? null : opleiding_jaar;
      
      const [existingUsers] = await db.promise().query(
        'SELECT * FROM gebruikers WHERE email = ? OR gebruikersnaam = ?',
        [email, gebruikersnaam]
      );
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email of gebruikersnaam bestaat al' });
      }

      // Hash het wachtwoord
      const hashedPassword = await bcrypt.hash(wachtwoord, 10);

      const [result] = await db.promise().query(
        'INSERT INTO gebruikers (voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbanden, linkedin, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [voornaam, naam, email, gebruikersnaam, hashedPassword, opleiding, opleidingJaarValue, dienstverbandenStr, linkedin, false, verificationToken]
      );
      console.log("Gebruiker succesvol toegevoegd in database:", email, "Token:", verificationToken);
      
      await sendVerificationEmail(email, verificationToken);
      console.log("Verificatiemail succesvol verzonden naar:", email);
      
      res.status(201).json({ message: 'Account succesvol aangemaakt. Controleer je e-mail voor de verificatielink.' });
    } catch (err) {
      console.error("Registratiefout:", err);
      res.status(500).json({ message: 'Interne fout bij het verwerken van je registratie.', details: err.message });
    }
  } else if (type === 'bedrijf') {
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      const {
        bedrijfsnaam, btw, straat, gemeente, telbedrijf, emailbedrijf, sector,
        beschrijving, gezocht_profiel_omschrijving, gezochte_opleidingen, dienstverbanden,
        voornaam_contact, naam_contact, specialisatie, email_contact, tel_contact,
        gebruikersnaam_bedrijf, wachtwoord_bedrijf
      } = userData;
      console.log("Nieuwe registratie gestart:", emailbedrijf);
      
      const [existingCompanies] = await connection.query(
        'SELECT * FROM bedrijven WHERE email = ? OR gebruikersnaam = ?',
        [emailbedrijf, gebruikersnaam_bedrijf]
      );
      if (existingCompanies.length > 0) {
        throw new Error('Email of gebruikersnaam bestaat al');
      }

      // Hash het wachtwoord
      const hashedPassword = await bcrypt.hash(wachtwoord_bedrijf, 10);

      const [result] = await connection.query(
        'INSERT INTO bedrijven (naam, BTW_nr, straatnaam, gemeente, telefoon_nr, email, contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon, gebruikersnaam, wachtwoord, sector, beschrijving, gezocht_profiel_omschrijving, gezochte_opleidingen, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [bedrijfsnaam, btw, straat, gemeente, telbedrijf, emailbedrijf, voornaam_contact, naam_contact, specialisatie, email_contact, tel_contact, gebruikersnaam_bedrijf, hashedPassword, sector, beschrijving, gezocht_profiel_omschrijving, gezochte_opleidingen, false, verificationToken]
      );
      console.log("Bedrijf succesvol toegevoegd in database:", emailbedrijf, "Token:", verificationToken);
      
      const bedrijfId = result.insertId;

      if (dienstverbanden && dienstverbanden.length > 0) {
        const dienstverbandQuery = 'INSERT INTO bedrijf_dienstverbanden (bedrijf_id, dienstverband_id) SELECT ?, id FROM dienstverbanden WHERE naam IN (?)';
        await connection.query(dienstverbandQuery, [bedrijfId, dienstverbanden]);
      }

      await sendVerificationEmail(emailbedrijf, verificationToken);
      console.log("Verificatiemail succesvol verzonden naar:", emailbedrijf);
      
      await connection.commit();
      res.status(201).json({ message: 'Account succesvol aangemaakt. Controleer je e-mail voor de verificatielink.' });

    } catch (err) {
      await connection.rollback();
      console.error("Registratiefout:", err);
      res.status(500).json({ message: 'Interne fout bij het verwerken van je registratie.', error: err.message || 'Database error' });
    } finally {
      connection.release();
    }
  } else {
    res.status(400).json({ error: 'Ongeldig registratietype' });
  }
});

// Reserve a speeddate (nieuwe implementatie met reserveringen tabel)
app.post('/api/reserveren', async (req, res) => {
  try {
    const { student_id, bedrijf_id, speed_id } = req.body;
    if (!student_id || !bedrijf_id || !speed_id) {
      return res.status(400).json({ error: 'student_id, bedrijf_id en speed_id zijn verplicht' });
    }

    // Controleer of de student al een actieve reservering heeft bij dit bedrijf
    const [existing] = await db.promise().query(
      'SELECT * FROM reserveringen WHERE student_id = ? AND bedrijf_id = ? AND status IN ("pending", "accepted", "alternative")',
      [student_id, bedrijf_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Je hebt al een reservering bij dit bedrijf. Annuleer eerst je bestaande reservering om een nieuwe te maken.' });
    }

    // Haal het tijdstip van het gewenste slot op
    const [slotRows] = await db.promise().query(
      'SELECT starttijd FROM speeddates WHERE speed_id = ?',
      [speed_id]
    );
    if (slotRows.length === 0) {
      return res.status(400).json({ error: 'Tijdslot niet gevonden.' });
    }
    const { starttijd } = slotRows[0];

    // Controleer of de student op dit tijdstip al ergens anders een reservering heeft
    const [conflict] = await db.promise().query(
      `SELECT r.* FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       WHERE r.student_id = ? AND s.starttijd = ? AND r.status IN ("pending", "accepted", "alternative")`,
      [student_id, starttijd]
    );
    if (conflict.length > 0) {
      return res.status(400).json({ error: 'Je hebt al een reservering bij een ander bedrijf op dit tijdstip.' });
    }

    // Controleer of het tijdslot nog beschikbaar is
    const [slots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE speed_id = ? AND bedrijf_id = ? AND is_bezet = 0',
      [speed_id, bedrijf_id]
    );

    if (slots.length === 0) {
      return res.status(400).json({ error: 'Dit tijdslot is niet meer beschikbaar' });
    }

    const slot = slots[0];

    // Maak een nieuwe reservering aan met status 'pending'
    const [result] = await db.promise().query(
      'INSERT INTO reserveringen (student_id, bedrijf_id, speed_id, status, created_at, updated_at) VALUES (?, ?, ?, "pending", NOW(), NOW())',
      [student_id, bedrijf_id, speed_id]
    );

    // Markeer het tijdslot als bezet
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 1 WHERE speed_id = ?',
      [speed_id]
    );
    
    // Stuur bevestiging naar de student
    res.json({ 
      message: 'Reservering succesvol aangemaakt en wacht op bevestiging van het bedrijf', 
      reservering_id: result.insertId,
      speed_id: slot.speed_id 
    });

    // Verstuur notificatie naar het bedrijf op de achtergrond
    (async () => {
      try {
        const [bedrijven] = await db.promise().query('SELECT * FROM bedrijven WHERE bedrijf_id = ?', [bedrijf_id]);
        const [studenten] = await db.promise().query('SELECT * FROM gebruikers WHERE gebruiker_id = ?', [student_id]);

        if (bedrijven.length > 0 && studenten.length > 0) {
          const bedrijf = bedrijven[0];
          const student = studenten[0];
          await sendReservationNotificationEmail(bedrijf, student, slot);
        }
      } catch (emailError) {
        console.error('Fout bij het versturen van de reservering-notificatie e-mail:', emailError);
      }
    })();

  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get user's reservations (nieuwe implementatie)
app.get('/api/reservaties/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, b.naam as bedrijfsnaam, b.sector, b.beschrijving, b.lokaal, b.verdieping,
              alt_s.starttijd as alt_starttijd, alt_s.eindtijd as alt_eindtijd
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       LEFT JOIN speeddates alt_s ON r.alternative_speed_id = alt_s.speed_id
       WHERE r.student_id = ? 
       ORDER BY s.starttijd`,
      [studentId]
    );
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get reservations for a company (nieuwe implementatie)
app.get('/api/bedrijf/reservaties/:bedrijfId', async (req, res) => {
  try {
    const [reservaties] = await db.promise().query(
      `SELECT r.*, g.voornaam, g.naam, g.email, g.linkedin, b.lokaal, b.verdieping,
              s.starttijd, s.eindtijd, alt_s.starttijd as alt_starttijd, alt_s.eindtijd as alt_eindtijd
       FROM reserveringen r 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       JOIN speeddates s ON r.speed_id = s.speed_id
       LEFT JOIN speeddates alt_s ON r.alternative_speed_id = alt_s.speed_id
       WHERE r.bedrijf_id = ? AND r.status != 'rejected'
       ORDER BY s.starttijd ASC`,
      [req.params.bedrijfId]
    );
    res.json(reservaties);
  } catch (err) {
    console.error('Error fetching company reservations:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Accept a reservation
app.post('/api/reservaties/:reserveringId/accepteren', async (req, res) => {
  try {
    const { reserveringId } = req.params;
    
    // Haal de reservering op
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, g.email, g.voornaam, g.naam, b.naam as bedrijfsnaam
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       WHERE r.reservering_id = ?`,
      [reserveringId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden' });
    }

    const reservation = reservations[0];
    
    if (reservation.status !== 'pending' && reservation.status !== 'alternative') {
      return res.status(400).json({ error: 'Reservering kan niet meer geaccepteerd worden' });
    }

    // Controleer of er al een geaccepteerde reservering is voor dit tijdslot
    const [existingAccepted] = await db.promise().query(
      `SELECT COUNT(*) as count FROM reserveringen 
       WHERE speed_id = ? AND status = 'accepted' AND reservering_id != ?`,
      [reservation.speed_id, reserveringId]
    );

    if (existingAccepted[0].count > 0) {
      return res.status(400).json({ error: 'Dit tijdslot is al geaccepteerd door een andere reservering' });
    }

    // Update de status naar 'accepted'
    await db.promise().query(
      'UPDATE reserveringen SET status = "accepted", updated_at = NOW() WHERE reservering_id = ?',
      [reserveringId]
    );

    // Markeer het tijdslot als bezet
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 1 WHERE speed_id = ?',
      [reservation.speed_id]
    );

    // Stuur e-mailnotificatie naar de student
    try {
      await sendReservationStatusUpdateEmail(
        reservation.email, 
        reservation.bedrijfsnaam, 
        { starttijd: reservation.starttijd, eindtijd: reservation.eindtijd }, 
        'accepted'
      );
    } catch (emailError) {
      console.error('Fout bij het versturen van acceptatie e-mail:', emailError);
    }

    res.json({ message: 'Reservering geaccepteerd' });

  } catch (err) {
    console.error('Error accepting reservation:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Reject a reservation
app.post('/api/reservaties/:reserveringId/afwijzen', async (req, res) => {
  try {
    const { reserveringId } = req.params;
    const { rejection_reason } = req.body;
    
    // Haal de reservering op
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, g.email, g.voornaam, g.naam, b.naam as bedrijfsnaam
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       WHERE r.reservering_id = ?`,
      [reserveringId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden' });
    }

    const reservation = reservations[0];
    
    if (reservation.status !== 'pending' && reservation.status !== 'alternative') {
      return res.status(400).json({ error: 'Reservering kan niet meer afgewezen worden' });
    }

    // Update de status naar 'rejected'
    await db.promise().query(
      'UPDATE reserveringen SET status = "rejected", rejection_reason = ?, updated_at = NOW() WHERE reservering_id = ?',
      [rejection_reason || null, reserveringId]
    );

    // Maak het tijdslot weer beschikbaar
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 0 WHERE speed_id = ?',
      [reservation.speed_id]
    );

    // Stuur e-mailnotificatie naar de student
    try {
      await sendReservationStatusUpdateEmail(
        reservation.email, 
        reservation.bedrijfsnaam, 
        { starttijd: reservation.starttijd, eindtijd: reservation.eindtijd }, 
        'rejected',
        rejection_reason
      );
    } catch (emailError) {
      console.error('Fout bij het versturen van afwijzing e-mail:', emailError);
    }

    res.json({ message: 'Reservering afgewezen' });

  } catch (err) {
    console.error('Error rejecting reservation:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Propose alternative timeslot
app.post('/api/reservaties/:reserveringId/alternatief', async (req, res) => {
  try {
    const { reserveringId } = req.params;
    const { alternative_speed_id } = req.body;
    
    if (!alternative_speed_id) {
      return res.status(400).json({ error: 'alternative_speed_id is verplicht' });
    }

    // Haal de reservering op
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, g.email, g.voornaam, g.naam, b.naam as bedrijfsnaam, b.bedrijf_id
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       WHERE r.reservering_id = ?`,
      [reserveringId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden' });
    }

    const reservation = reservations[0];
    
    if (reservation.status !== 'pending') {
      return res.status(400).json({ error: 'Alleen pending reserveringen kunnen een alternatief krijgen' });
    }

    // Controleer of het alternatieve tijdslot beschikbaar is
    const [altSlots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE speed_id = ? AND bedrijf_id = ? AND is_bezet = 0',
      [alternative_speed_id, reservation.bedrijf_id]
    );

    if (altSlots.length === 0) {
      return res.status(400).json({ error: 'Alternatief tijdslot is niet beschikbaar' });
    }

    const altSlot = altSlots[0];

    // Update de reservering met het alternatieve tijdslot
    await db.promise().query(
      'UPDATE reserveringen SET status = "alternative", alternative_speed_id = ?, updated_at = NOW() WHERE reservering_id = ?',
      [alternative_speed_id, reserveringId]
    );

    // Markeer het alternatieve tijdslot als bezet bij acceptatie
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 1 WHERE speed_id = ?',
      [reservation.alternative_speed_id]
    );

    // Stuur e-mailnotificatie naar de student
    try {
      await sendAlternativeProposalEmail(
        reservation.email,
        { naam: reservation.bedrijfsnaam },
        { starttijd: reservation.starttijd, eindtijd: reservation.eindtijd },
        { starttijd: altSlot.starttijd, eindtijd: altSlot.eindtijd }
      );
    } catch (emailError) {
      console.error('Fout bij het versturen van alternatief voorstel e-mail:', emailError);
    }

    res.json({ message: 'Alternatief tijdslot voorgesteld' });

  } catch (err) {
    console.error('Error proposing alternative:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Student responds to alternative proposal
app.post('/api/reservaties/:reserveringId/alternatief-antwoord', async (req, res) => {
  try {
    const { reserveringId } = req.params;
    const { accepted } = req.body;
    
    if (typeof accepted !== 'boolean') {
      return res.status(400).json({ error: 'accepted moet true of false zijn' });
    }

    // Haal de reservering op
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, g.email, g.voornaam, g.naam, b.naam as bedrijfsnaam, b.email as bedrijf_email
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       WHERE r.reservering_id = ?`,
      [reserveringId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden' });
    }

    const reservation = reservations[0];
    
    if (reservation.status !== 'alternative') {
      return res.status(400).json({ error: 'Reservering heeft geen alternatief voorstel' });
    }

    if (accepted) {
      // Accepteer het alternatieve tijdslot en update speed_id naar alternative_speed_id
      await db.promise().query(
        'UPDATE reserveringen SET status = "accepted", speed_id = alternative_speed_id, alternative_speed_id = NULL, updated_at = NOW() WHERE reservering_id = ?',
        [reserveringId]
      );

      // Markeer het alternatieve tijdslot als bezet bij acceptatie
      await db.promise().query(
        'UPDATE speeddates SET is_bezet = 1 WHERE speed_id = ?',
        [reservation.alternative_speed_id]
      );

      // Haal het alternatieve tijdslot op
      const [altSlots] = await db.promise().query(
        'SELECT * FROM speeddates WHERE speed_id = ?',
        [reservation.alternative_speed_id]
      );

      if (altSlots.length > 0) {
        const altSlot = altSlots[0];
        
        // Stuur e-mailnotificatie naar het bedrijf
        try {
          await sendAlternativeResponseEmail(
            reservation.bedrijf_email,
            { voornaam: reservation.voornaam, naam: reservation.naam },
            { starttijd: altSlot.starttijd, eindtijd: altSlot.eindtijd },
            true
          );
        } catch (emailError) {
          console.error('Fout bij het versturen van acceptatie e-mail naar bedrijf:', emailError);
        }
      }

      res.json({ message: 'Alternatief tijdslot geaccepteerd' });

    } else {
      // Weiger het alternatieve tijdslot
      await db.promise().query(
        'UPDATE reserveringen SET status = "rejected", updated_at = NOW() WHERE reservering_id = ?',
        [reserveringId]
      );

      // Maak alleen het oorspronkelijke tijdslot weer beschikbaar
      // Het alternatieve tijdslot blijft beschikbaar omdat het nooit bezet was
      await db.promise().query(
        'UPDATE speeddates SET is_bezet = 0 WHERE speed_id = ?',
        [reservation.speed_id]
      );

      // Stuur e-mailnotificatie naar het bedrijf
      try {
        await sendAlternativeResponseEmail(
          reservation.bedrijf_email,
          { voornaam: reservation.voornaam, naam: reservation.naam },
          { starttijd: reservation.starttijd, eindtijd: reservation.eindtijd },
          false
        );
      } catch (emailError) {
        console.error('Fout bij het versturen van weigering e-mail naar bedrijf:', emailError);
      }

      res.json({ message: 'Alternatief tijdslot geweigerd' });
    }

  } catch (err) {
    console.error('Error responding to alternative:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Cancel a reservation (student)
app.delete('/api/reservaties/:reserveringId', async (req, res) => {
  try {
    const { reserveringId } = req.params;
    
    // Haal de reservering op met alle benodigde informatie voor e-mailnotificatie
    const [reservations] = await db.promise().query(
      `SELECT r.*, s.starttijd, s.eindtijd, g.voornaam, g.naam, g.email, b.naam as bedrijfsnaam, b.email as bedrijf_email
       FROM reserveringen r 
       JOIN speeddates s ON r.speed_id = s.speed_id 
       JOIN gebruikers g ON r.student_id = g.gebruiker_id 
       JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id 
       WHERE r.reservering_id = ?`,
      [reserveringId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden' });
    }

    const reservation = reservations[0];
    
    // Sta annulering toe voor alle statussen behalve rejected
    if (reservation.status === 'rejected') {
      return res.status(400).json({ error: 'Geweigerde reserveringen kunnen niet geannuleerd worden' });
    }

    // Maak de tijdsloten weer beschikbaar
    const slotsToFree = [reservation.speed_id];
    if (reservation.alternative_speed_id) {
      slotsToFree.push(reservation.alternative_speed_id);
    }

    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 0 WHERE speed_id IN (?)',
      [slotsToFree]
    );

    // Stuur e-mailnotificatie naar het bedrijf
    try {
      await sendCancellationNotificationEmail(
        reservation.bedrijf_email,
        { voornaam: reservation.voornaam, naam: reservation.naam, email: reservation.email },
        { starttijd: reservation.starttijd, eindtijd: reservation.eindtijd },
        reservation.bedrijfsnaam
      );
    } catch (emailError) {
      console.error('Fout bij het versturen van annulering e-mail:', emailError);
    }

    // Verwijder de reservering
    await db.promise().query(
      'DELETE FROM reserveringen WHERE reservering_id = ?',
      [reserveringId]
    );

    res.json({ message: 'Reservering geannuleerd' });

  } catch (err) {
    console.error('Error canceling reservation:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Profiel updaten (student)
app.patch('/api/profiel/:gebruikerId', async (req, res) => {
  try {
    const { gebruikerId } = req.params;
    const { voornaam, naam, email, gebruikersnaam, opleiding, opleiding_jaar, dienstverbanden, linkedin, wachtwoord } = req.body;
    // dienstverbanden als JSON-string opslaan
    const dienstverbandenStr = dienstverbanden ? JSON.stringify(dienstverbanden) : null;
    
    // Build dynamic query based on which fields are provided
    let query = 'UPDATE gebruikers SET voornaam = ?, naam = ?, email = ?, gebruikersnaam = ?, opleiding = ?, opleiding_jaar = ?, dienstverbanden = ?, linkedin = ?';
    let params = [voornaam, naam, email, gebruikersnaam, opleiding, opleiding_jaar, dienstverbandenStr, linkedin];
    
    // Add wachtwoord to update if provided
    if (wachtwoord && wachtwoord.trim() !== '') {
      query += ', wachtwoord = ?';
      params.push(wachtwoord);
    }
    
    query += ' WHERE gebruiker_id = ?';
    params.push(gebruikerId);
    
    const [result] = await db.promise().query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error profiel updaten:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Profiel ophalen (student)
app.get('/api/profiel/:gebruikerId', async (req, res) => {
  try {
    const { gebruikerId } = req.params;
    const [rows] = await db.promise().query('SELECT * FROM gebruikers WHERE gebruiker_id = ?', [gebruikerId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden.' });
    }
    const user = rows[0];
    // Parse dienstverbanden als JSON-array
    if (user.dienstverbanden) {
      try {
        user.dienstverbanden = JSON.parse(user.dienstverbanden);
      } catch (e) {
        user.dienstverbanden = [];
      }
    } else {
      user.dienstverbanden = [];
    }
    delete user.wachtwoord;
    res.json(user);
  } catch (err) {
    console.error('Error profiel ophalen:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get all students
app.get('/api/studenten', async (req, res) => {
  try {
    const [studenten] = await db.promise().query('SELECT * FROM gebruikers');
    res.json(studenten);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get single student profile
app.get('/api/studenten/:studentId', async (req, res) => {
  try {
    const [studenten] = await db.promise().query(
      'SELECT * FROM gebruikers WHERE gebruiker_id = ?',
      [req.params.studentId]
    );
    
    if (studenten.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    const student = studenten[0];
    delete student.wachtwoord; // Remove password from response
    
    res.json(student);
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

//    Opmerking verwijder niet deze script want ik gaan dat later hergebruiken


// data importeren van bedrijvenlijst.json en deze in databank opslaan
/*const data =JSON.parse(fs.readFileSync('bedrijvenlijst.json', 'utf8'));
 
data.forEach(bedrijf => {
  const { name, url, doelgroep_jaar, doelgroep_opleiding, aanbiedingen } = bedrijf; 

  const inserBedijf = `INSERT INTO bedrijven (naam, bedrijf_URL) VALUES (?, ?)`;
  
  db.query(inserBedijf, [name, url], (err, result) =>{
    if(err){
      console.error('fout bij invoegen bedrijf: ', name, err);
      return;
    }

    const bedrijfId = result.insertId;

    doelgroep_jaar.forEach(jaar => {
      db.query(
      `INSERT INTO bedrijf_doelgroep_jaar (bedrijf_id, jaar) VALUES (?, ?)`,
      [bedrijfId, jaar]
      );
    });

    doelgroep_opleiding.forEach(opleiding => {
      db.query(
        `INSERT INTO bedrijf_doelgroep_opl (bedrijf_id, opleiding) VALUES (?, ?)`,
        [bedrijfId, opleiding]
      );
    });

    aanbiedingen.forEach(type => {
      db.query(
        `INSERT INTO bedrijven_aanbiedingen (bedrijf_id, type) VALUES (?, ?)`,
        [bedrijfId, type]
      );
    });

    const sqlSpeeddates = `INSERT INTO speeddates (bedrijf_id, is_bezet) VALUES (?, ?)`;
    db.query(sqlSpeeddates, [bedrijfId, bedrijf.speeddates], (err) => {
      if (err) throw err;
    });
    

  });

console.log(`ingevoegd: ${name}`);
});
*/

// POST om bedrijfsprofiel bij te werken
app.post('/api/bedrijf/update', async (req, res) => {
  const { 
    bedrijf_id, 
    dienstverbanden,
    bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente,
    telefoon_nr, email, contact_voornaam, contact_naam, contact_specialisatie,
    contact_email, contact_telefoon, gebruikersnaam, wachtwoord, sector, 
    beschrijving, gezocht_profiel_omschrijving, gezochte_opleidingen 
  } = req.body;

  if (!bedrijf_id) {
    return res.status(400).json({ error: 'bedrijf_id is verplicht' });
  }

  const updatableBedrijfsData = {
    bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente,
    telefoon_nr, email, contact_voornaam, contact_naam, contact_specialisatie,
    contact_email, contact_telefoon, gebruikersnaam, sector, 
    beschrijving, gezocht_profiel_omschrijving, gezochte_opleidingen
  };

  if (wachtwoord) {
    updatableBedrijfsData.wachtwoord = wachtwoord;
  }

  Object.keys(updatableBedrijfsData).forEach(key => updatableBedrijfsData[key] === undefined && delete updatableBedrijfsData[key]);

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const updateQuery = 'UPDATE bedrijven SET ? WHERE bedrijf_id = ?';
    if (Object.keys(updatableBedrijfsData).length > 0) {
      await connection.query(updateQuery, [updatableBedrijfsData, bedrijf_id]);
    }

    await connection.query('DELETE FROM bedrijf_dienstverbanden WHERE bedrijf_id = ?', [bedrijf_id]);

    if (dienstverbanden && dienstverbanden.length > 0) {
      const dienstverbandQuery = 'INSERT INTO bedrijf_dienstverbanden (bedrijf_id, dienstverband_id) SELECT ?, id FROM dienstverbanden WHERE naam IN (?)';
      await connection.query(dienstverbandQuery, [bedrijf_id, dienstverbanden]);
    }
    
    await connection.commit();

    res.status(200).json({ message: 'Profiel succesvol bijgewerkt.' });

  } catch (err) {
    await connection.rollback();
    console.error(`Fout bij bijwerken bedrijfsprofiel voor ID ${bedrijf_id}:`, err);
    res.status(500).json({ error: 'Databasefout bij bijwerken profiel', details: err.message });
  } finally {
    connection.release();
  }
});

// Create timeslots for a company
app.post('/api/speeddates/create', async (req, res) => {
  try {
    const { bedrijf_id, date } = req.body;
    
    if (!bedrijf_id || !date) {
      return res.status(400).json({ error: 'bedrijf_id en date zijn verplicht' });
    }

    // Tijdsloten genereren voor de opgegeven datum
    // Van 10:00 tot 13:00 en 14:00 tot 16:00, elke 10 minuten
    const slots = [];
    const baseDate = new Date(date);
    
    // Ochtend slots (10:00 - 13:00)
    for (let hour = 10; hour < 13; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const startTime = new Date(baseDate);
        startTime.setHours(hour, minute, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 10);
        
        slots.push([startTime, endTime]);
      }
    }
    
    // Middag slots (14:00 - 16:00)
    for (let hour = 14; hour < 16; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const startTime = new Date(baseDate);
        startTime.setHours(hour, minute, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 10);
        
        slots.push([startTime, endTime]);
      }
    }

    // Slots in de database invoegen
    for (const [starttijd, eindtijd] of slots) {
      await db.promise().query(
        'INSERT INTO speeddates (bedrijf_id, starttijd, eindtijd) VALUES (?, ?, ?)',
        [bedrijf_id, starttijd, eindtijd]
      );
    }

    res.json({ message: 'Tijdsloten succesvol aangemaakt', count: slots.length });
  } catch (err) {
    console.error('Error creating timeslots:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// API endpoint om tijdsloten aan te maken voor alle bedrijven die nog geen tijdsloten hebben
app.post('/api/speeddates/create-for-all-companies', async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Haal alle bedrijven op
    const [bedrijven] = await db.promise().query('SELECT bedrijf_id FROM bedrijven');
    
    if (!bedrijven.length) {
      return res.status(404).json({ error: 'Geen bedrijven gevonden' });
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const bedrijf of bedrijven) {
      // Controleer of er al tijdsloten zijn voor dit bedrijf
      const [bestaande] = await db.promise().query(
        'SELECT COUNT(*) as aantal FROM speeddates WHERE bedrijf_id = ?', 
        [bedrijf.bedrijf_id]
      );
      
      if (bestaande[0].aantal > 0) {
        console.log(`Bedrijf_id ${bedrijf.bedrijf_id} heeft al tijdsloten, overslaan.`);
        skippedCount++;
        continue;
      }

      // Maak tijdsloten aan voor dit bedrijf
      const success = await createTimeslotsForBedrijf(bedrijf.bedrijf_id, targetDate.toISOString().split('T')[0]);
      if (success) {
        createdCount++;
      }
    }

    res.json({ 
      message: 'Tijdsloten verwerking voltooid', 
      created: createdCount, 
      skipped: skippedCount,
      total: bedrijven.length 
    });
  } catch (err) {
    console.error('Error creating timeslots for all companies:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// GET bedrijfsprofiel data (inclusief dienstverbanden)
app.get('/api/bedrijf/profiel/:id', async (req, res) => {
  const bedrijfId = req.params.id;

  if (!bedrijfId) {
    return res.status(400).json({ error: 'Bedrijf ID is verplicht' });
  }

  try {
    // 1. Haal basis bedrijfsinformatie op
    const [bedrijven] = await db.promise().query('SELECT * FROM bedrijven WHERE bedrijf_id = ?', [bedrijfId]);
    if (bedrijven.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }
    const bedrijf = bedrijven[0];
    delete bedrijf.wachtwoord; // Stuur nooit het wachtwoord terug

    // 2. Haal de gekoppelde dienstverbanden op
    const [dienstverbanden] = await db.promise().query(`
      SELECT d.naam 
      FROM bedrijf_dienstverbanden bd
      JOIN dienstverbanden d ON bd.dienstverband_id = d.id
      WHERE bd.bedrijf_id = ?
    `, [bedrijfId]);

    // 3. Voeg de lijst van dienstverband-namen toe aan het bedrijfs-object
    bedrijf.dienstverbanden = dienstverbanden.map(d => d.naam);

    res.json(bedrijf);

  } catch (err) {
    console.error('Fout bij ophalen bedrijfsprofiel:', err);
    res.status(500).json({ error: 'Databasefout bij ophalen profiel' });
  }
});

// Haal alle tijdsloten op voor een specifiek bedrijf
app.get('/api/speeddates/:bedrijfId', async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const [slots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE bedrijf_id = ? ORDER BY starttijd',
      [bedrijfId]
    );
    res.json(slots);
  } catch (err) {
    console.error('Error fetching speeddates:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// === BEDRIJFSREGISTRATIE (Correctie op basis van live DB schema) ===
app.post('/api/register-bedrijf', async (req, res) => {
  const {
    bedrijfsnaam, gebruikersnaam, wachtwoord, email, kvk_nummer, sector, 
    website_url, adres, postcode, stad, contactpersoon_naam, 
    contactpersoon_email, contactpersoon_telefoon, specialisatie, 
    gezochte_opleidingen, dienstverbanden, gezocht_profiel_omschrijving,
    telbedrijf, beschrijving
  } = req.body;

  if (!bedrijfsnaam || !gebruikersnaam || !wachtwoord || !email) {
    return res.status(400).json({ error: 'Verplichte velden ontbreken.' });
  }

  let connection;
  try {
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // === Stap 1: Controleer op bestaande gebruikers/e-mails ===
    const [emailExists] = await connection.execute('SELECT email FROM bedrijven WHERE email = ?', [email]);
    if (emailExists.length > 0) throw new Error('Dit e-mailadres is al in gebruik.');

    const [usernameExists] = await connection.execute('SELECT gebruikersnaam FROM bedrijven WHERE gebruikersnaam = ?', [gebruikersnaam]);
    if (usernameExists.length > 0) throw new Error('Deze gebruikersnaam is al in gebruik.');

    // === Stap 2: Data voorbereiden voor INSERT ===
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(wachtwoord, 10);
    const [contact_voornaam, ...contact_naam_parts] = contactpersoon_naam.split(' ');
    const contact_naam = contact_naam_parts.join(' ');
    
    // === Stap 3: Hoofd-INSERT in 'bedrijven' tabel ===
    const insertBedrijfQuery = `
      INSERT INTO bedrijven (
        naam, BTW_nr, straatnaam, postcode, gemeente, telefoon_nr, email,
        contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon,
        gebruikersnaam, wachtwoord, sector, beschrijving, gezochte_opleidingen, 
        gezocht_profiel_omschrijving, bedrijf_URL, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    const bedrijfParams = [
      bedrijfsnaam, kvk_nummer, adres, postcode, stad, telbedrijf, email,
      contact_voornaam, contact_naam, specialisatie, contactpersoon_email, contactpersoon_telefoon,
      gebruikersnaam, hashedPassword, sector, beschrijving, 
      Array.isArray(gezochte_opleidingen) ? gezochte_opleidingen.join(', ') : '',
      gezocht_profiel_omschrijving, website_url
    ];

    const [result] = await connection.execute(insertBedrijfQuery, bedrijfParams);
    const nieuwBedrijfId = result.insertId;

    // === Stap 4: Data invoegen in koppeltabel 'bedrijf_dienstverbanden' ===
    if (dienstverbanden && Array.isArray(dienstverbanden) && dienstverbanden.length > 0) {
      const [alleDienstverbanden] = await connection.execute('SELECT id, naam FROM dienstverbanden');
      const dienstverbandIds = dienstverbanden
        .map(naam => alleDienstverbanden.find(d => d.naam === naam)?.id)
        .filter(id => id); 

      if (dienstverbandIds.length > 0) {
        const insertDienstverbandQuery = 'INSERT INTO bedrijf_dienstverbanden (bedrijf_id, dienstverband_id) VALUES ?';
        const dienstverbandValues = dienstverbandIds.map(id => [nieuwBedrijfId, id]);
        await connection.query(insertDienstverbandQuery, [dienstverbandValues]);
      }
    }

    // === Stap 5: Tijdsloten aanmaken ===
    await createTimeslotsForBedrijf(nieuwBedrijfId, EVENEMENT_DATUM);

    // === Stap 6: Transactie afronden ===
    await connection.commit();

    res.status(201).json({ 
      message: 'Bedrijf succesvol geregistreerd. U kunt nu inloggen.',
      bedrijfId: nieuwBedrijfId 
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('FATALE FOUT TIJDENS BEDRIJFSREGISTRATIE:', error);
    res.status(500).json({ error: error.message || 'Interne serverfout.' });
  } finally {
    if (connection) connection.release();
  }
});

// === STUDENTENREGISTRATIE (met e-mailverificatie) ===
app.post('/api/register-student', async (req, res) => {
    const { gebruikersnaam, email, wachtwoord, opleiding, LinkedIn_profiel, CV_link, motivatie, voorkeur_bedrijfstype, gezochte_dienstverband } = req.body;
    console.log("Nieuwe registratie gestart:", email);
    if (!email || !wachtwoord || !gebruikersnaam) {
        return res.status(400).json({ error: 'Gebruikersnaam, e-mail en wachtwoord zijn verplicht.' });
    }

    let connection;
    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        const [emailExists] = await connection.execute('SELECT email FROM gebruikers WHERE email = ?', [email]);
        if (emailExists.length > 0) {
            throw new Error('Dit e-mailadres is al in gebruik.');
        }

        const [usernameExists] = await connection.execute('SELECT gebruikersnaam FROM gebruikers WHERE gebruikersnaam = ?', [gebruikersnaam]);
        if (usernameExists.length > 0) {
            throw new Error('Deze gebruikersnaam is al in gebruik.');
        }

        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(wachtwoord, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = {
            gebruikersnaam,
            email,
            wachtwoord: hashedPassword,
            opleiding,
            LinkedIn_profiel,
            CV_link,
            motivatie,
            voorkeur_bedrijfstype,
            gezochte_dienstverband,
            is_verified: 0,
            verification_token: verificationToken,
            rol: 'student'
        };

        await connection.execute(
            'INSERT INTO gebruikers SET ?',
            newUser
        );
        console.log("Gebruiker succesvol toegevoegd in database:", email);

        const verificationUrl = `${process.env.CLIENT_URL}/confirm/${verificationToken}`;
        await sendVerificationEmail(email, verificationUrl, gebruikersnaam);
        console.log("Verificatiemail succesvol verzonden naar:", email);

        await connection.commit();

        res.status(201).send({ message: 'Registratie geslaagd! Controleer je e-mail om je account te verifiëren.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Registratiefout:", error);
        res.status(409).json({ message: "Interne fout bij het verwerken van je registratie.", error: error.message || 'Kon student niet registreren.' });
    } finally {
        if (connection) connection.release();
    }
});

// Fallback voor ongedefinieerde routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route niet gevonden' });
});
