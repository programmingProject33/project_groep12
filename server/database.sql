-- Active: 1718991690076@@127.0.0.1@3306@2425PROGPROJ02
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS 2425PROGPROJ02;

-- Use the database
USE 2425PROGPROJ02;

-- Drop tables in reverse order of dependency to avoid foreign key errors
DROP TABLE IF EXISTS `reserveringen`;
DROP TABLE IF EXISTS `speeddates`;
DROP TABLE IF EXISTS `bedrijven`;
DROP TABLE IF EXISTS `gebruikers`;

-- Gebruikers (studenten) tabel
CREATE TABLE `gebruikers` (
    `gebruiker_id` INT AUTO_INCREMENT PRIMARY KEY,
    `voornaam` VARCHAR(50) NOT NULL,
    `naam` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `gebruikersnaam` VARCHAR(50) NOT NULL UNIQUE,
    `wachtwoord` VARCHAR(255) NOT NULL,
    `opleiding` VARCHAR(100),
    `opleiding_jaar` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `dienstverbanden` TEXT,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `verification_token` VARCHAR(255)
);

-- Bedrijven tabel
CREATE TABLE `bedrijven` (
    `bedrijf_id` INT AUTO_INCREMENT PRIMARY KEY,
    `bedrijf_URL` VARCHAR(255),
    `naam` VARCHAR(100) NOT NULL,
    `BTW_nr` VARCHAR(30),
    `straatnaam` VARCHAR(100),
    `huis_nr` VARCHAR(10),
    `bus_nr` VARCHAR(10),
    `postcode` VARCHAR(10),
    `gemeente` VARCHAR(100),
    `telefoon_nr` VARCHAR(30),
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `contact_voornaam` VARCHAR(50),
    `contact_naam` VARCHAR(50),
    `contact_specialisatie` VARCHAR(100),
    `contact_email` VARCHAR(100),
    `contact_telefoon` VARCHAR(30),
    `gebruikersnaam` VARCHAR(50) NOT NULL UNIQUE,
    `wachtwoord` VARCHAR(255) NOT NULL,
    `sector` VARCHAR(100),
    `beschrijving` TEXT,
    `zoeken_we` TEXT,
    `lokaal` VARCHAR(50),
    `verdieping` VARCHAR(50),
    `number_of_representatives` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_verified` BOOLEAN DEFAULT FALSE,
    `verification_token` VARCHAR(255)
);

-- Speeddates tabel
CREATE TABLE `speeddates` (
    `speed_id` INT AUTO_INCREMENT PRIMARY KEY,
    `bedrijf_id` INT NOT NULL,
    `starttijd` DATETIME NOT NULL,
    `eindtijd` DATETIME NOT NULL,
    FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven`(`bedrijf_id`) ON DELETE CASCADE
);

-- Reserveringen tabel (Nieuwe, correcte structuur)
CREATE TABLE `reserveringen` (
    `reservering_id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `bedrijf_id` INT NOT NULL,
    `speed_id` INT NOT NULL,
    `status` ENUM('pending', 'accepted', 'rejected', 'alternative') DEFAULT 'pending',
    `alternative_speed_id` INT,
    `rejection_reason` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `gebruikers`(`gebruiker_id`) ON DELETE CASCADE,
    FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven`(`bedrijf_id`) ON DELETE CASCADE,
    FOREIGN KEY (`speed_id`) REFERENCES `speeddates`(`speed_id`) ON DELETE CASCADE,
    FOREIGN KEY (`alternative_speed_id`) REFERENCES `speeddates`(`speed_id`) ON DELETE SET NULL
);

-- Indexen voor betere performance
CREATE INDEX `idx_reserveringen_status` ON `reserveringen`(`status`);
CREATE INDEX `idx_reserveringen_student` ON `reserveringen`(`student_id`);
CREATE INDEX `idx_reserveringen_bedrijf` ON `reserveringen`(`bedrijf_id`);

