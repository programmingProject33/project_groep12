require('dotenv').config(); // laad .env

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de verbinding
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Fout bij verbinden met MySQL:', err);
        return;
    }
    console.log('Verbonden met de MySQL database!');
    connection.release();
});

// Voeg een error handler toe voor de pool
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

module.exports = pool;