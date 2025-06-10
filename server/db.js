require('dotenv').config(); // laad .env

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

connection.connect((err) =>{
    if(err){
        console.error('Fout bij verbinden met MySQL:', err);
        return;
    }
    console.log('Verbonden met de MySQL database!')
});

module.exports = connection;