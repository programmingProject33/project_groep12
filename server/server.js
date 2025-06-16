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
      const { voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbanden } = userData;
      const dienstverbandenStr = dienstverbanden ? JSON.stringify(dienstverbanden) : null;
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
        'INSERT INTO gebruikers (voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbanden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [voornaam, naam, email, gebruikersnaam, wachtwoord, opleiding, opleiding_jaar, dienstverbandenStr]
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
      gebruikersnaam_bedrijf, wachtwoord_bedrijf 
    } = userData;
    
    // Check if company already exists
    db.query('SELECT * FROM bedrijven WHERE emailbedrijf = ? OR gebruikersnaam = ?', 
      [emailbedrijf, gebruikersnaam_bedrijf], 
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
          bedrijfsnaam, kvk, btw, straat, gemeente, telbedrijf, emailbedrijf,
          voornaam_contact, naam_contact, specialisatie, email_contact, tel_contact,
          gebruikersnaam, wachtwoord
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
          bedrijfsnaam, kvk, btw, straat, gemeente, telbedrijf, emailbedrijf,
          voornaam_contact, naam_contact, specialisatie, email_contact, tel_contact,
          gebruikersnaam_bedrijf, wachtwoord_bedrijf
        ];
        
        console.log('Executing query:', query);
        console.log('With values:', values);
        
        db.query(query, values, (err, result) => {
          if (err) {
            console.error('Database error creating company:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
          }
          console.log('Company created successfully:', result);
          res.status(201).json({ message: 'Bedrijfsaccount succesvol aangemaakt' });
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

    // Controleer of de student al een actieve reservatie heeft bij dit bedrijf
    const [existing] = await db.promise().query(
      'SELECT * FROM speeddates WHERE user_id = ? AND bedrijf_id = ? AND is_bezet = 1',
      [user_id, bedrijf_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Je hebt al een reservatie bij dit bedrijf. Annuleer eerst je bestaande reservatie om een nieuwe te maken.' });
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

// Profiel updaten (student)
app.patch('/api/profiel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { voornaam, naam, email, opleiding, opleiding_jaar, dienstverbanden } = req.body;
    // dienstverbanden als JSON-string opslaan
    const dienstverbandenStr = dienstverbanden ? JSON.stringify(dienstverbanden) : null;
    const [result] = await db.promise().query(
      `UPDATE gebruikers SET voornaam = ?, naam = ?, email = ?, opleiding = ?, opleiding_jaar = ?, dienstverbanden = ? WHERE id = ?`,
      [voornaam, naam, email, opleiding, opleiding_jaar, dienstverbandenStr, id]
    );
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
app.get('/api/profiel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.promise().query('SELECT * FROM gebruikers WHERE id = ?', [id]);
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
    // Eerst updaten
    await db.promise().query(
      `UPDATE bedrijven SET naam = ?, email = ?, gebruikersnaam = ?, beschrijving = ?, bedrijf_URL = ? WHERE bedrijf_id = ?`,
      [naam, email, gebruikersnaam, beschrijving, bedrijf_URL, id]
    );
    
    // Dan de volledige geüpdatete data ophalen
    const [updatedBedrijf] = await db.promise().query(
      'SELECT * FROM bedrijven WHERE bedrijf_id = ?',
      [id]
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
