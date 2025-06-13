const express = require('express');
const cors = require('cors');
const db = require('./db');

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
