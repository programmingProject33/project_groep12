-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS careerlaunch;

-- Use the database
USE careerlaunch;

-- Create gebruikers table
CREATE TABLE IF NOT EXISTS gebruikers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voornaam VARCHAR(50) NOT NULL,
    naam VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    gebruikersnaam VARCHAR(50) NOT NULL UNIQUE,
    wachtwoord VARCHAR(255) NOT NULL,
    opleiding VARCHAR(100),
    opleiding_jaar INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verwijder de bestaande bedrijven tabel als die bestaat
DROP TABLE IF EXISTS bedrijven;

-- Maak de nieuwe bedrijven tabel aan met de gewenste kolommen
CREATE TABLE IF NOT EXISTS bedrijven (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verwijder alle bestaande tijdsloten om dubbele invoer te voorkomen
DELETE FROM speeddates;

-- Create speeddates table
CREATE TABLE IF NOT EXISTS speeddates (
    speed_id INT AUTO_INCREMENT PRIMARY KEY,
    bedrijf_id INT NOT NULL,
    user_id INT,
    starttijd DATETIME NOT NULL,
    eindtijd DATETIME NOT NULL,
    is_bezet BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bedrijf_id) REFERENCES bedrijven(id),
    FOREIGN KEY (user_id) REFERENCES gebruikers(id)
);

