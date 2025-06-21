const express = require('express');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');
const { sendVerificationEmail, sendReservationNotificationEmail } = require('./mailer');

// admin routes importeren 
const adminLogin = require('./routes/adminLogin');           // POST /api/admin/login
const adminProfile = require('./routes/adminProfile');       // GET /api/admin/me, PUT /api/admin/update
const adminProtected = require('./routes/adminProtected');   // GET /api/admin/dashboard
const adminRoutes = require('./routes/admins');               // GET/POST/DELETE /api/admin/admins
const bedrijvenRoutes = require('./routes/bedrijven');       // GET /api/admin/bedrijven
const studentenRoutes = require('./routes/studenten');       // GET /api/admin/studenten
const speeddatesRoutes = require('./routes/speeddates');     // GET/POST/PUT /api/admin/speeddates
const statistiekenRoutes = require('./routes/stats');        // GET /api/admin/stats

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

// === Initialisatie bedrijven-tabel verwijderd ===

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLaunch API is running' });
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { gebruikersnaam, wachtwoord, type } = req.body;

  try {
    const table = type === 'student' ? 'gebruikers' : 'bedrijven';
    
    const [users] = await db.promise().query(
      `SELECT * FROM ${table} WHERE gebruikersnaam = ?`,
      [gebruikersnaam]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
    }

    const user = users[0];

    // Stap 1: Controleer of het account geverifieerd is.
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Account niet geverifieerd. Controleer je e-mail voor de verificatielink.' });
    }

    // Stap 2: Vergelijk het wachtwoord.
    // Aanname: wachtwoorden zijn plain text opgeslagen. Voor productie is hashen essentieel.
    if (user.wachtwoord !== wachtwoord) {
      return res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
    }
    
    // Stap 3: Login succesvol.
    delete user.wachtwoord;
    
    res.json({
      message: 'Login succesvol',
      user: {
        ...user,
        type: type
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Database error', 
      details: err.message 
    });
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

app.get('/api/bedrijven', (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) =>{
    if(err) {
      console.error('Database error:', err);
      return res.status(500).json({error: 'Database error', details: err.message});
    }
    res.json(results);
  });
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

// User registration endpoint
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
        return res.status(400).json({ error: 'Email of gebruikersnaam bestaat al' });
      }

      const [result] = await db.promise().query(
        'INSERT INTO gebruikers (voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbanden, linkedin, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleidingJaarValue, dienstverbandenStr, linkedin, false, verificationToken]
      );
      
      await sendVerificationEmail(email, verificationToken);
      
      res.status(201).json({ message: 'Account succesvol aangemaakt. Controleer je e-mail voor de verificatielink.' });
    } catch (err) {
      console.error('Error in student registration:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  } else if (type === 'bedrijf') {
    try {
        const {
            bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente, telefoon_nr, email,
            contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon,
            gebruikersnaam, wachtwoord, sector, beschrijving, zoeken_we, number_of_representatives
        } = userData;

        // 1. Controleer of email of gebruikersnaam al bestaat
        const [existingBedrijven] = await db.promise().query(
            'SELECT * FROM bedrijven WHERE email = ? OR gebruikersnaam = ?',
            [email, gebruikersnaam]
        );
        if (existingBedrijven.length > 0) {
            return res.status(400).json({ error: 'Email of gebruikersnaam voor bedrijf bestaat al' });
        }

        // 2. Zoek een vrije locatie
        const [gebruikteLokalen] = await db.promise().query('SELECT lokaal FROM bedrijven WHERE lokaal IS NOT NULL');
        const gebruikteLokaalNamen = gebruikteLokalen.map(b => b.lokaal);
        const vrijeLocatie = BESCHIKBARE_LOCATIES.find(loc => !gebruikteLokaalNamen.includes(loc.lokaal));

        if (!vrijeLocatie) {
            return res.status(500).json({ error: 'Geen vrije locaties meer beschikbaar voor het evenement.' });
        }

        // 3. Voeg bedrijf toe aan de database met de toegewezen locatie
        const [result] = await db.promise().query(
            `INSERT INTO bedrijven (bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente, telefoon_nr, email, contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon, gebruikersnaam, wachtwoord, sector, beschrijving, zoeken_we, lokaal, verdieping, number_of_representatives, is_verified, verification_token) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente, telefoon_nr, email, contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon, gebruikersnaam, wachtwoord, sector, beschrijving, zoeken_we, vrijeLocatie.lokaal, vrijeLocatie.verdieping, number_of_representatives, false, verificationToken]
        );
        
        const nieuwBedrijfId = result.insertId;

        // 4. Maak tijdsloten aan voor het nieuwe bedrijf
        await createTimeslotsForBedrijf(nieuwBedrijfId, EVENEMENT_DATUM);
        
        // 5. Stuur verificatie-email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Bedrijfsaccount succesvol aangemaakt. Een locatie en tijdsloten zijn toegewezen. Controleer je e-mail voor de verificatielink.' });
    } catch (err) {
        console.error('Error in bedrijf registration:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
  } else {
    res.status(400).json({ error: 'Ongeldig type gebruiker' });
  }
});

// Reserve a speeddate
app.post('/api/speeddate', async (req, res) => {
  try {
    const { gebruiker_id, bedrijf_id, speed_id } = req.body;
    if (!gebruiker_id || !bedrijf_id || !speed_id) {
      return res.status(400).json({ error: 'gebruiker_id, bedrijf_id en speed_id zijn verplicht' });
    }

    // Controleer of de student al een actieve reservatie heeft bij dit bedrijf
    const [existing] = await db.promise().query(
      'SELECT * FROM speeddates WHERE gebruiker_id = ? AND bedrijf_id = ? AND is_bezet = 1',
      [gebruiker_id, bedrijf_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Je hebt al een reservatie bij dit bedrijf. Annuleer eerst je bestaande reservatie om een nieuwe te maken.' });
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

    // Controleer of de student op dit tijdstip al ergens anders een reservatie heeft
    const [conflict] = await db.promise().query(
      'SELECT * FROM speeddates WHERE gebruiker_id = ? AND starttijd = ? AND is_bezet = 1',
      [gebruiker_id, starttijd]
    );
    if (conflict.length > 0) {
      return res.status(400).json({ error: 'Je hebt al een reservatie bij een ander bedrijf op dit tijdstip.' });
    }

    // Find the exact slot by speed_id
    const [slots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE speed_id = ? AND bedrijf_id = ? AND is_bezet = 0',
      [speed_id, bedrijf_id]
    );

    if (slots.length === 0) {
      return res.status(400).json({ error: 'Dit tijdslot is niet meer beschikbaar' });
    }

    const slot = slots[0];
    // Reserve the exact slot
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 1, gebruiker_id = ? WHERE speed_id = ?',
      [gebruiker_id, speed_id]
    );
    
    // Stuur bevestiging naar de student
    res.json({ message: 'Speeddate succesvol gereserveerd', speed_id: slot.speed_id });

    // Verstuur notificatie naar het bedrijf op de achtergrond
    (async () => {
      try {
        const [bedrijven] = await db.promise().query('SELECT * FROM bedrijven WHERE bedrijf_id = ?', [bedrijf_id]);
        const [studenten] = await db.promise().query('SELECT * FROM gebruikers WHERE gebruiker_id = ?', [gebruiker_id]);

        if (bedrijven.length > 0 && studenten.length > 0) {
          const bedrijf = bedrijven[0];
          const student = studenten[0];
          await sendReservationNotificationEmail(bedrijf, student, slot);
        }
      } catch (emailError) {
        console.error('Fout bij het versturen van de reservatie-notificatie e-mail:', emailError);
      }
    })();

  } catch (err) {
    console.error('Error reserving speeddate:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get all timeslots for a specific bedrijf
app.get('/api/speeddates/:bedrijfId', async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const [slots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE bedrijf_id = ? ORDER BY starttijd',
      [bedrijfId]
    );
    console.log("bedrijfId", bedrijfId);
    res.json(slots);
  } catch (err) {
    console.error('Error fetching speeddates:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get user's reservations
app.get('/api/reservations/:gebruikerId', async (req, res) => {
  try {
    const { gebruikerId } = req.params;
    const [reservations] = await db.promise().query(
      `SELECT s.*, b.naam as bedrijfsnaam, b.sector, b.beschrijving, b.lokaal, b.verdieping 
       FROM speeddates s 
       JOIN bedrijven b ON s.bedrijf_id = b.bedrijf_id 
       WHERE s.gebruiker_id = ? AND s.is_bezet = 1 
       ORDER BY s.starttijd`,
      [gebruikerId]
    );
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Annuleer een reservering
app.delete('/api/reservations/:speed_id', async (req, res) => {
  try {
    const { speed_id } = req.params;
    const [result] = await db.promise().query(
      'UPDATE speeddates SET is_bezet = 0, gebruiker_id = NULL WHERE speed_id = ?',
      [speed_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservering niet gevonden.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error annuleer reservering:', err);
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

// Profiel van bedrijf updaten
app.post('/api/bedrijf/update', async (req, res) => {
  console.log('Ontvangen body voor update:', req.body); // Debug log
  const {
    gebruikerId,
    naam,
    BTW_nr,
    bedrijf_URL,
    straatnaam,
    huis_nr,
    bus_nr,
    postcode,
    gemeente,
    telefoon_nr,
    email,
    contact_voornaam,
    contact_naam,
    contact_specialisatie,
    contact_email,
    contact_telefoon,
    gebruikersnaam,
    wachtwoord,
    sector,
    beschrijving,
    zoeken_we
  } = req.body;
  if (!gebruikerId) {
    return res.status(400).json({ error: 'Bedrijf ID ontbreekt' });
  }
  try {
    // Alle velden updaten behalve bedrijf_id en created_at
    await db.promise().query(
      `UPDATE bedrijven SET 
        naam = ?, 
        BTW_nr = ?,
        bedrijf_URL = ?,
        straatnaam = ?,
        huis_nr = ?,
        bus_nr = ?,
        postcode = ?,
        gemeente = ?,
        telefoon_nr = ?,
        email = ?,
        contact_voornaam = ?,
        contact_naam = ?,
        contact_specialisatie = ?,
        contact_email = ?,
        contact_telefoon = ?,
        gebruikersnaam = ?,
        wachtwoord = ?,
        sector = ?,
        beschrijving = ?,
        zoeken_we = ?
      WHERE bedrijf_id = ?`,
      [
        naam,
        BTW_nr,
        bedrijf_URL,
        straatnaam,
        huis_nr,
        bus_nr,
        postcode,
        gemeente,
        telefoon_nr,
        email,
        contact_voornaam,
        contact_naam,
        contact_specialisatie,
        contact_email,
        contact_telefoon,
        gebruikersnaam,
        wachtwoord,
        sector,
        beschrijving,
        zoeken_we,
        gebruikerId
      ]
    );
    // Dan de volledige geüpdatete data ophalen
    const [updatedBedrijf] = await db.promise().query(
      'SELECT * FROM bedrijven WHERE bedrijf_id = ?',
      [gebruikerId]
    );
    if (updatedBedrijf.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden na update' });
    }
    const user = updatedBedrijf[0];
    delete user.wachtwoord; // Verwijder wachtwoord uit response
    res.json({
      message: 'Profiel succesvol bijgewerkt',
      user: user
    });
  } catch (err) {
    console.error('Fout bij updaten profiel:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get reservations for a company
app.get('/api/bedrijf/reservaties/:bedrijfId', async (req, res) => {
  try {
    const [reservaties] = await db.promise().query(
      `SELECT s.*, g.voornaam, g.naam, g.linkedin, b.lokaal, b.verdieping 
       FROM speeddates s 
       JOIN gebruikers g ON s.gebruiker_id = g.gebruiker_id 
       JOIN bedrijven b ON s.bedrijf_id = b.bedrijf_id 
       WHERE s.bedrijf_id = ? AND s.is_bezet = 1 
       ORDER BY s.starttijd ASC`,
      [req.params.bedrijfId]
    );
    res.json(reservaties);
  } catch (err) {
    console.error('Error fetching company reservations:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
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

// Email verification endpoint
app.get('/api/verify', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Verificatie token is vereist' });
    }

    try {
        // Probeer de token te vinden in de 'gebruikers' tabel
        let [userResult] = await db.promise().query(
            'SELECT * FROM gebruikers WHERE verification_token = ?', [token]
        );

        if (userResult.length > 0) {
            // Gebruiker gevonden, update de status
            await db.promise().query(
                'UPDATE gebruikers SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?', [token]
            );
            return res.status(200).json({ message: 'E-mailadres succesvol geverifieerd! U kunt nu inloggen.' });
        }

        // Als niet in gebruikers, probeer de 'bedrijven' tabel
        let [bedrijfResult] = await db.promise().query(
            'SELECT * FROM bedrijven WHERE verification_token = ?', [token]
        );

        if (bedrijfResult.length > 0) {
            // Bedrijf gevonden, update de status
            await db.promise().query(
                'UPDATE bedrijven SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?', [token]
            );
            return res.status(200).json({ message: 'E-mailadres succesvol geverifieerd! U kunt nu inloggen.' });
        }

        // Als in geen van beide tabellen gevonden
        return res.status(404).json({ error: 'Ongeldige of verlopen verificatietoken.' });

    } catch (err) {
        console.error('Error during verification:', err);
        res.status(500).json({ error: 'Databasefout tijdens verificatieproces.' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
