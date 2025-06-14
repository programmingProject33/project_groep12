const express = require('express');
const cors = require('cors');
const db = require('./db');
/* const fs = require('fs');  verwijder dit niet het leest de josn file  */

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLaunch API is running' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { gebruikersnaam, wachtwoord, type } = req.body;
    console.log('Login attempt:', { gebruikersnaam, type });

    // Determine which table to query based on user type
    const table = type === 'student' ? 'gebruikers' : 'bedrijven';
    
    // Query the appropriate table
    const [users] = await db.promise().query(
      `SELECT * FROM ${table} WHERE gebruikersnaam = ? AND wachtwoord = ?`,
      [gebruikersnaam, wachtwoord]
    );

    if (users.length > 0) {
      const user = users[0];
      // Remove sensitive information
      delete user.wachtwoord;
      
      res.json({
        message: 'Login succesvol',
        user: {
          ...user,
          type: type
        }
      });
    } else {
      res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
    }
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

// User registration endpoint
app.post('/api/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  const { type, ...userData } = req.body;

  
  if (type === 'student') {
    try {
      const { voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar } = userData;

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
    const {
      bedrijfsnaam, kvk, btw, straat, gemeente, telbedrijf, emailbedrijf,
      voornaam_contact, naam_contact, specialisatie, email_contact, tel_contact,
      gebruikersnaam_bedrijf, wachtwoord_bedrijf, sector, beschrijving, zoeken_we
    } = userData;

    // Map frontend fields to database columns
    const bedrijf_URL = ""; // Not provided by frontend
    const naam = bedrijfsnaam;
    const BTW_nr = btw;
    const huis_nr = ""; // Not provided by frontend
    const bus_nr = ""; // Not provided by frontend
    const contact_email = email_contact;
    const contact_naam = naam_contact;
    const contact_specialisatie = specialisatie;
    const contact_telefoon = tel_contact;
    const contact_voornaam = voornaam_contact;
    const email = emailbedrijf;
    const gebruikersnaam = gebruikersnaam_bedrijf;
    const telefoon_nr = telbedrijf;
    const wachtwoord = wachtwoord_bedrijf;
    const straatnaam = straat;
    const postcode = ""; // Not provided by frontend

    // Check if company already exists
    db.query('SELECT * FROM bedrijven WHERE email = ? OR gebruikersnaam = ?',
      [email, gebruikersnaam],
      (err, results) => {
        if (err) {
          console.error('Database error checking existing company:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: 'Email of gebruikersnaam bestaat al' });
        }

        // Insert new company
        const query = `INSERT INTO bedrijven (
          bedrijf_URL, beschrijving, BTW_nr, bus_nr, contact_email, contact_naam, contact_specialisatie, contact_telefoon, contact_voornaam, email, gebruikersnaam, gemeente, huis_nr, naam, postcode, sector, straatnaam, telefoon_nr, wachtwoord, zoeken_we
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          bedrijf_URL, beschrijving, BTW_nr, bus_nr, contact_email, contact_naam, contact_specialisatie, contact_telefoon, contact_voornaam, email, gebruikersnaam, gemeente, huis_nr, naam, postcode, sector, straatnaam, telefoon_nr, wachtwoord, zoeken_we
        ];
        
        console.log('Executing query:', query);
        console.log('With values:', values);
        
        db.query(query, values, async (err, result) => {
          if (err) {
            console.error('Database error creating company:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
          }
          console.log('Company created successfully:', result);
          // Create timeslots for this bedrijf
          const bedrijf_id = result.insertId;
          const date = new Date();
          date.setHours(10, 0, 0, 0); // 10:00
          const slots = [];
          for (let i = 0; i < 8 * 6; i++) { // 8 hours * 6 slots per hour = 48 slots
            const start = new Date(date.getTime() + i * 10 * 60000);
            const end = new Date(start.getTime() + 10 * 60000);
            slots.push([start, end, 0, null, bedrijf_id]);
          }
          try {
            await db.promise().query(
              'INSERT INTO speeddates (starttijd, eindtijd, is_bezet, user_id, bedrijf_id) VALUES ?',[slots]
            );
            res.status(201).json({ message: 'Bedrijfsaccount succesvol aangemaakt en timeslots aangemaakt' });
          } catch (err2) {
            console.error('Error creating timeslots:', err2);
            res.status(201).json({ message: 'Bedrijfsaccount succesvol aangemaakt, maar timeslots NIET aangemaakt', error: err2.message });
          }
        });
      }
    );
  } else {
    res.status(400).json({ error: 'Ongeldig type gebruiker' });
  }
});

// Reserve a speeddate
app.post('/api/speeddate', async (req, res) => {
  try {
    const { user_id, bedrijf_id, speed_id } = req.body;
    if (!user_id || !bedrijf_id || !speed_id) {
      return res.status(400).json({ error: 'user_id, bedrijf_id en speed_id zijn verplicht' });
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
      'UPDATE speeddates SET is_bezet = 1, user_id = ? WHERE speed_id = ?',
      [user_id, speed_id]
    );
    res.json({ message: 'Speeddate succesvol gereserveerd', speed_id: slot.speed_id });
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
app.get('/api/reservations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [reservations] = await db.promise().query(
      `SELECT s.*, b.naam as bedrijfsnaam, b.sector, b.beschrijving 
       FROM speeddates s 
       JOIN bedrijven b ON s.bedrijf_id = b.bedrijf_id 
       WHERE s.user_id = ? AND s.is_bezet = 1 
       ORDER BY s.starttijd`,
      [userId]
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
      'UPDATE speeddates SET is_bezet = 0, user_id = NULL WHERE speed_id = ?',
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
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
