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
    dienstverbanden TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bedrijven table
CREATE TABLE IF NOT EXISTS bedrijven (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bedrijfsnaam VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    gebruikersnaam VARCHAR(50) NOT NULL UNIQUE,
    wachtwoord VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 