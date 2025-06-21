-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS 2425PROGPROJ02;

-- Use the database
USE 2425PROGPROJ02;

-- Gebruikers (studenten) tabel - bestaande structuur
CREATE TABLE IF NOT EXISTS gebruikers (
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
    is_verified TINYINT(1) DEFAULT 0,
    verification_token VARCHAR(255) DEFAULT NULL,
    linkedin VARCHAR(255)
);

-- Bedrijven tabel
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
    lokaal VARCHAR(50),
    verdieping VARCHAR(50),
    number_of_representatives INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255)
);

-- Verwijder alle bestaande tijdsloten om dubbele invoer te voorkomen
DELETE FROM speeddates;

-- Create speeddates table
CREATE TABLE IF NOT EXISTS speeddates (
    speed_id INT AUTO_INCREMENT PRIMARY KEY,
    bedrijf_id INT NOT NULL,
    starttijd DATETIME NOT NULL,
    eindtijd DATETIME NOT NULL,
    is_bezet BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gebruiker_id INT,
    capacity INT,
    reserved_count INT,
    FOREIGN KEY (bedrijf_id) REFERENCES bedrijven(bedrijf_id),
    FOREIGN KEY (gebruiker_id) REFERENCES gebruikers(gebruiker_id)
);

-- Add linkedin column to existing gebruikers table if it doesn't exist
ALTER TABLE gebruikers ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);

