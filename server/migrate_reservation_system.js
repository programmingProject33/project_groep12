const db = require('./db');
require('dotenv').config();

async function runMigration() {
  let connection;
  try {
    connection = await db.promise();
    console.log('🚀 Start migratie naar het definitieve reserveringssysteem...');

    // Stap 1: Drop alle tabellen in de juiste volgorde om conflicten te vermijden
    console.log('🧹 Oude tabellenstructuur opruimen...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DROP TABLE IF EXISTS reserveringen, speeddates, bedrijven, gebruikers;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Oude tabellen verwijderd.');

    // Stap 2: Maak de tabellen opnieuw aan met de correcte structuur
    console.log('🏗️ Nieuwe tabellen aanmaken...');

    // Gebruikers tabel
    await connection.query(`
      CREATE TABLE gebruikers (
          gebruiker_id INT AUTO_INCREMENT PRIMARY KEY,
          voornaam VARCHAR(50) NOT NULL,
          naam VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          gebruikersnaam VARCHAR(50) NOT NULL UNIQUE,
          wachtwoord VARCHAR(255) NOT NULL,
          opleiding VARCHAR(100),
          opleiding_jaar INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          dienstverbanden TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255)
      )
    `);
    console.log('✅ Tabel "gebruikers" aangemaakt.');

    // Bedrijven tabel
    await connection.query(`
      CREATE TABLE bedrijven (
          bedrijf_id INT AUTO_INCREMENT PRIMARY KEY,
          bedrijf_URL VARCHAR(255),
          naam VARCHAR(100) NOT NULL,
          BTW_nr VARCHAR(30),
          straatnaam VARCHAR(100),
          huis_nr VARCHAR(10),
          bus_nr VARCHAR(10),
          postcode VARCHAR(10),
          gemeente VARCHAR(100),
          telefoon_nr VARCHAR(30),
          email VARCHAR(100) NOT NULL UNIQUE,
          contact_voornaam VARCHAR(50),
          contact_naam VARCHAR(50),
          contact_specialisatie VARCHAR(100),
          contact_email VARCHAR(100),
          contact_telefoon VARCHAR(30),
          gebruikersnaam VARCHAR(50) NOT NULL UNIQUE,
          wachtwoord VARCHAR(255) NOT NULL,
          sector VARCHAR(100),
          beschrijving TEXT,
          zoeken_we TEXT,
          lokaal VARCHAR(50),
          verdieping VARCHAR(50),
          number_of_representatives INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255)
      )
    `);
    console.log('✅ Tabel "bedrijven" aangemaakt.');

    // Speeddates tabel
    await connection.query(`
      CREATE TABLE speeddates (
          speed_id INT AUTO_INCREMENT PRIMARY KEY,
          bedrijf_id INT NOT NULL,
          starttijd DATETIME NOT NULL,
          eindtijd DATETIME NOT NULL,
          is_bezet BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (bedrijf_id) REFERENCES bedrijven(bedrijf_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabel "speeddates" aangemaakt.');

    // Reserveringen tabel
    await connection.query(`
      CREATE TABLE reserveringen (
          reservering_id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          bedrijf_id INT NOT NULL,
          speed_id INT NOT NULL,
          status ENUM('pending', 'accepted', 'rejected', 'alternative') DEFAULT 'pending',
          alternative_speed_id INT,
          rejection_reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES gebruikers(gebruiker_id) ON DELETE CASCADE,
          FOREIGN KEY (bedrijf_id) REFERENCES bedrijven(bedrijf_id) ON DELETE CASCADE,
          FOREIGN KEY (speed_id) REFERENCES speeddates(speed_id) ON DELETE CASCADE,
          FOREIGN KEY (alternative_speed_id) REFERENCES speeddates(speed_id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabel "reserveringen" aangemaakt.');

    console.log('\n🎉 Database migratie succesvol voltooid! De structuur is nu correct.');
    console.log('Je kunt nu de server herstarten en de applicatie gebruiken.');

  } catch (error) {
    console.error('❌ Fout tijdens de migratie:', error);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
}

runMigration(); 