const db = require('./db');
require('dotenv').config();

const alterReservationsTable = async () => {
  let connection;
  try {
    connection = await db.promise();
    console.log('🚀 Starten met het updaten van de "reserveringen" tabel...');

    // Functie om te controleren of een kolom bestaat
    const columnExists = async (tableName, columnName) => {
      const [columns] = await connection.query(`
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [process.env.DB_DATABASE, tableName, columnName]
      );
      return columns.length > 0;
    };

    // Voeg 'status' kolom toe
    if (!await columnExists('reserveringen', 'status')) {
      await connection.query("ALTER TABLE reserveringen ADD COLUMN status ENUM('pending', 'accepted', 'rejected', 'alternative') DEFAULT 'pending'");
      console.log('✅ Kolom "status" toegevoegd.');
    } else {
      console.log('ℹ️ Kolom "status" bestaat al.');
    }

    // Voeg 'alternative_speed_id' kolom toe
    if (!await columnExists('reserveringen', 'alternative_speed_id')) {
      await connection.query("ALTER TABLE reserveringen ADD COLUMN alternative_speed_id INT NULL");
      console.log('✅ Kolom "alternative_speed_id" toegevoegd.');
    } else {
      console.log('ℹ️ Kolom "alternative_speed_id" bestaat al.');
    }

    // Voeg 'rejection_reason' kolom toe
    if (!await columnExists('reserveringen', 'rejection_reason')) {
      await connection.query("ALTER TABLE reserveringen ADD COLUMN rejection_reason TEXT NULL");
      console.log('✅ Kolom "rejection_reason" toegevoegd.');
    } else {
      console.log('ℹ️ Kolom "rejection_reason" bestaat al.');
    }
    
    console.log('🎉 Tabel "reserveringen" is succesvol bijgewerkt en up-to-date.');

  } catch (error) {
    console.error('❌ Fout bij het updaten van de tabel:', error);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
};

alterReservationsTable(); 