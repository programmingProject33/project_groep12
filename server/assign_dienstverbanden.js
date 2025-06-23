const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '2425PROGPROJ02'
};

const dienstverbanden = ['Voltijds', 'Deeltijds', 'Freelance', 'Stage'];

async function assignDienstverbanden() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Verbonden met database...');

        // Haal alle gebruikers op
        const [users] = await connection.execute('SELECT gebruiker_id, voornaam, naam FROM gebruikers');
        console.log(`Gevonden ${users.length} gebruikers`);

        // Verdeel gebruikers over dienstverbanden
        for (let i = 0; i < users.length; i++) {
            const dienstverband = dienstverbanden[i % dienstverbanden.length];
            const userId = users[i].gebruiker_id;
            
            await connection.execute(
                'UPDATE gebruikers SET dienstverbanden = ? WHERE gebruiker_id = ?',
                [dienstverband, userId]
            );
            
            console.log(`${users[i].voornaam} ${users[i].naam} (ID: ${userId}) -> ${dienstverband}`);
        }

        console.log('\n✅ Alle gebruikers hebben nu een dienstverband toegewezen!');
        
        // Toon statistieken
        for (const dienstverband of dienstverbanden) {
            const [count] = await connection.execute(
                'SELECT COUNT(*) as count FROM gebruikers WHERE dienstverbanden = ?',
                [dienstverband]
            );
            console.log(`${dienstverband}: ${count[0].count} gebruikers`);
        }

    } catch (error) {
        console.error('Fout bij toewijzen dienstverbanden:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Voer het script uit
assignDienstverbanden(); 