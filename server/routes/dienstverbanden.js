const express = require('express');
const router = express.Router();
const db = require('../db');

// Haal alle gebruikers op met hun dienstverbanden
router.get('/gebruikers', async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT gebruiker_id, voornaam, naam, email, opleiding, opleiding_jaar, dienstverbanden 
            FROM gebruikers 
            ORDER BY voornaam, naam
        `);
        
        res.json(users);
    } catch (error) {
        console.error('Fout bij ophalen gebruikers:', error);
        res.status(500).json({ error: 'Fout bij ophalen gebruikers' });
    }
});

// Update dienstverband van een gebruiker
router.put('/gebruiker/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { dienstverbanden } = req.body;
        
        if (!dienstverbanden) {
            return res.status(400).json({ error: 'Dienstverbanden is verplicht' });
        }
        
        const [result] = await db.execute(
            'UPDATE gebruikers SET dienstverbanden = ? WHERE gebruiker_id = ?',
            [dienstverbanden, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }
        
        res.json({ message: 'Dienstverbanden succesvol bijgewerkt' });
    } catch (error) {
        console.error('Fout bij updaten dienstverbanden:', error);
        res.status(500).json({ error: 'Fout bij updaten dienstverbanden' });
    }
});

// Haal statistieken op van dienstverbanden
router.get('/statistieken', async (req, res) => {
    try {
        const [stats] = await db.execute(`
            SELECT 
                dienstverbanden,
                COUNT(*) as aantal
            FROM gebruikers 
            WHERE dienstverbanden IS NOT NULL
            GROUP BY dienstverbanden
            ORDER BY aantal DESC
        `);
        
        res.json(stats);
    } catch (error) {
        console.error('Fout bij ophalen statistieken:', error);
        res.status(500).json({ error: 'Fout bij ophalen statistieken' });
    }
});

// Wijs alle gebruikers automatisch dienstverbanden toe
router.post('/toewijzen', async (req, res) => {
    try {
        const dienstverbanden = ['Voltijds', 'Deeltijds', 'Freelance', 'Stage'];
        
        // Haal alle gebruikers op
        const [users] = await db.execute('SELECT gebruiker_id FROM gebruikers');
        
        // Verdeel gebruikers over dienstverbanden
        for (let i = 0; i < users.length; i++) {
            const dienstverband = dienstverbanden[i % dienstverbanden.length];
            const userId = users[i].gebruiker_id;
            
            await db.execute(
                'UPDATE gebruikers SET dienstverbanden = ? WHERE gebruiker_id = ?',
                [dienstverband, userId]
            );
        }
        
        res.json({ 
            message: `Dienstverbanden toegewezen aan ${users.length} gebruikers`,
            totaal: users.length
        });
    } catch (error) {
        console.error('Fout bij toewijzen dienstverbanden:', error);
        res.status(500).json({ error: 'Fout bij toewijzen dienstverbanden' });
    }
});

module.exports = router; 