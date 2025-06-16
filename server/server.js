const express = require('express');
const cors = require('cors');
const db = require('./db');
/* const fs = require('fs');  verwijder dit niet het leest de josn file  */

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// === Initialisatie bedrijven-tabel verwijderd ===

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLaunch API is running' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  console.log('Login endpoint aangeroepen met body:', req.body); // Debug log
  try {
    const { gebruikersnaam, wachtwoord, type } = req.body;
    console.log('Login attempt:', { gebruikersnaam, type });

    if (type === 'student') {
      // Student login
      const [users] = await db.promise().query(
        `SELECT * FROM gebruikers WHERE gebruikersnaam = ? AND wachtwoord = ?`,
        [gebruikersnaam, wachtwoord]
      );
      if (users.length > 0) {
        const user = users[0];
        delete user.wachtwoord;
        res.json({
          message: 'Login succesvol',
          user: { ...user, type }
        });
      } else {
        res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
      }
    } else if (type === 'bedrijf') {
      // Bedrijf login
      const [bedrijven] = await db.promise().query(
        `SELECT * FROM bedrijven WHERE gebruikersnaam = ? AND wachtwoord = ?`,
        [gebruikersnaam, wachtwoord]
      );
      if (bedrijven.length > 0) {
        const bedrijf = bedrijven[0];
        delete bedrijf.wachtwoord;
        res.json({
          message: 'Login succesvol',
          user: { ...bedrijf, type }
        });
      } else {
        res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
      }
    } else {
      res.status(400).json({ error: 'Ongeldig type gebruiker' });
    }
  } catch (err) {
    console.error('Login error:', err); // Log de error
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

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { type, ...userData } = req.body;

  if (type === 'student') {
    try {
      const { voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar } = userData;
      
      // First check table structure
      const [structure] = await db.promise().query('DESCRIBE gebruikers');
      console.log('Table structure:', structure);

      // Check if user exists
      const [existingUsers] = await db.promise().query(
        'SELECT * FROM gebruikers WHERE email = ? OR gebruikersnaam = ?',
        [email, gebruikersnaam]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email of gebruikersnaam bestaat al' });
      }

      // Insert new user
      const [result] = await db.promise().query(
        'INSERT INTO gebruikers (voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar]
      );

      console.log('User created successfully:', result);
      res.status(201).json({ message: 'Account succesvol aangemaakt' });
    } catch (err) {
      console.error('Error in student registration:', err);
      res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState,
        code: err.code
      });
    }
  } else if (type === 'bedrijf') {
    try {
      // Haal alle velden uit het formulier
      const {
        bedrijfsnaam, // => naam
        bedrijf_URL,
        btw, // => BTW_nr
        straat, // => straatnaam
        huis_nr,
        bus_nr,
        postcode,
        gemeente,
        telbedrijf, // => telefoon_nr
        emailbedrijf, // => email
        voornaam_contact, // => contact_voornaam
        naam_contact, // => contact_naam
        specialisatie, // => contact_specialisatie
        email_contact, // => contact_email
        tel_contact, // => contact_telefoon
        gebruikersnaam_bedrijf, // => gebruikersnaam
        wachtwoord_bedrijf // => wachtwoord
      } = userData;

      // Check of gebruikersnaam of email al bestaat
      const [existing] = await db.promise().query(
        'SELECT * FROM bedrijven WHERE email = ? OR gebruikersnaam = ?',
        [emailbedrijf, gebruikersnaam_bedrijf]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email of gebruikersnaam bestaat al' });
      }

      // Insert bedrijf
      await db.promise().query(
        `INSERT INTO bedrijven (
          bedrijf_URL, naam, BTW_nr, straatnaam, huis_nr, bus_nr, postcode, gemeente, telefoon_nr, email,
          contact_voornaam, contact_naam, contact_specialisatie, contact_email, contact_telefoon,
          gebruikersnaam, wachtwoord
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bedrijf_URL || '',
          bedrijfsnaam,
          btw,
          straat,
          huis_nr || '',
          bus_nr || '',
          postcode,
          gemeente,
          telbedrijf,
          emailbedrijf,
          voornaam_contact,
          naam_contact,
          specialisatie,
          email_contact,
          tel_contact,
          gebruikersnaam_bedrijf,
          wachtwoord_bedrijf
        ]
      );

      res.status(201).json({ message: 'Bedrijf succesvol geregistreerd' });
    } catch (err) {
      console.error('Error in bedrijf registratie:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  } else {
    res.status(400).json({ error: 'Ongeldig type gebruiker' });
  }
});

// Reserve a speeddate
app.post('/api/speeddate', async (req, res) => {
  try {
    const { user_id, bedrijf_id, starttijd, eindtijd } = req.body;
    if (!user_id || !bedrijf_id) {
      return res.status(400).json({ error: 'user_id en bedrijf_id zijn verplicht' });
    }
    // Find a free slot for this bedrijf
    const [slots] = await db.promise().query(
      'SELECT * FROM speeddates WHERE bedrijf_id = ? AND is_bezet = 0 LIMIT 1',
      [bedrijf_id]
    );
    if (slots.length === 0) {
      return res.status(400).json({ error: 'Geen vrije tijdsloten beschikbaar voor dit bedrijf' });
    }
    const slot = slots[0];
    // Reserve the slot
    await db.promise().query(
      'UPDATE speeddates SET is_bezet = 1, user_id = ? WHERE speed_id = ?',
      [user_id, slot.speed_id]
    );
    res.json({ message: 'Speeddate succesvol gereserveerd', speed_id: slot.speed_id });
  } catch (err) {
    console.error('Error reserving speeddate:', err);
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
      'SELECT * FROM gebruikers WHERE id = ?',
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
  const { id, naam, email, gebruikersnaam, beschrijving, bedrijf_URL } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Bedrijf ID ontbreekt' });
  }
  try {
    await db.promise().query(
      `UPDATE bedrijven SET naam = ?, email = ?, gebruikersnaam = ?, beschrijving = ?, bedrijf_URL = ? WHERE bedrijf_id = ?`,
      [naam, email, gebruikersnaam, beschrijving, bedrijf_URL, id]
    );
    res.json({ message: 'Profiel succesvol bijgewerkt' });
  } catch (err) {
    console.error('Fout bij updaten profiel:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get reservations for a company
app.get('/api/bedrijf/reservaties/:bedrijfId', async (req, res) => {
  try {
    const [reservaties] = await db.promise().query(
      `SELECT s.*, g.voornaam, g.naam, g.gebruikersnaam, g.email 
       FROM speeddates s 
       JOIN gebruikers g ON s.user_id = g.id 
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
