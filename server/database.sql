-- Creëer de database als deze nog niet bestaat
CREATE DATABASE IF NOT EXISTS `careerlaunch`;
USE `careerlaunch`;

-- Tabel voor de soorten dienstverbanden (Master data)
DROP TABLE IF EXISTS `dienstverbanden`;
CREATE TABLE `dienstverbanden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naam_unique` (`naam`)
) ENGINE=InnoDB;

-- Vul de dienstverbanden tabel met de standaardwaarden
INSERT INTO `dienstverbanden` (`naam`) VALUES
('Stage'),
('Voltijds'),
('Deeltijds'),
('Freelance'),
('Studentenjob');

-- Tabel voor beheerders
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gebruikersnaam` varchar(255) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `rol` enum('admin','superadmin') NOT NULL DEFAULT 'admin',
  `creatie_datum` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`)
) ENGINE=InnoDB;

-- Tabel voor studenten/gebruikers
DROP TABLE IF EXISTS `gebruikers`;
CREATE TABLE `gebruikers` (
  `gebruiker_id` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  `voornaam` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `wachtwoord` varchar(255) NOT NULL,
  `geboortedatum` date DEFAULT NULL,
  `telefoonnummer` varchar(20) DEFAULT NULL,
  `straatnaam` varchar(255) DEFAULT NULL,
  `huis_nr` varchar(10) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `gemeente` varchar(255) DEFAULT NULL,
  `land` varchar(255) DEFAULT NULL,
  `opleiding` varchar(255) DEFAULT NULL,
  `cv_pad` varchar(255) DEFAULT NULL,
  `motivatiebrief_pad` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `gebruikersnaam` varchar(255) DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'student',
  `profile_image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gebruiker_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`)
) ENGINE=InnoDB;

-- Tabel voor bedrijven
DROP TABLE IF EXISTS `bedrijven`;
CREATE TABLE `bedrijven` (
  `bedrijf_id` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `beschrijving` text,
  `gezochte_opleidingen` text COMMENT 'Door komma gescheiden lijst van opleidingen waar het bedrijf naar zoekt.',
  `gezocht_profiel_omschrijving` text COMMENT 'Omschrijving van het profiel dat het bedrijf zoekt.',
  `locatie_straat` varchar(255) DEFAULT NULL,
  `locatie_huisnummer` varchar(10) DEFAULT NULL,
  `locatie_postcode` varchar(10) DEFAULT NULL,
  `locatie_gemeente` varchar(255) DEFAULT NULL,
  `contactpersoon_email` varchar(255) NOT NULL,
  `contactpersoon_telefoon` varchar(20) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `wachtwoord` varchar(255) DEFAULT NULL,
  `gebruikersnaam` varchar(255) DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'bedrijf',
  PRIMARY KEY (`bedrijf_id`),
  UNIQUE KEY `contactpersoon_email` (`contactpersoon_email`),
  UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`)
) ENGINE=InnoDB;

-- Koppeltabel studenten en hun gewenste dienstverbanden (Many-to-Many)
DROP TABLE IF EXISTS `student_dienstverbanden`;
CREATE TABLE `student_dienstverbanden` (
  `gebruiker_id` int NOT NULL,
  `dienstverband_id` int NOT NULL,
  PRIMARY KEY (`gebruiker_id`,`dienstverband_id`),
  KEY `dienstverband_id` (`dienstverband_id`),
  CONSTRAINT `student_dienstverbanden_ibfk_1` FOREIGN KEY (`gebruiker_id`) REFERENCES `gebruikers` (`gebruiker_id`) ON DELETE CASCADE,
  CONSTRAINT `student_dienstverbanden_ibfk_2` FOREIGN KEY (`dienstverband_id`) REFERENCES `dienstverbanden` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Koppeltabel bedrijven en hun aangeboden dienstverbanden (Many-to-Many)
DROP TABLE IF EXISTS `bedrijf_dienstverbanden`;
CREATE TABLE `bedrijf_dienstverbanden` (
  `bedrijf_id` int NOT NULL,
  `dienstverband_id` int NOT NULL,
  PRIMARY KEY (`bedrijf_id`,`dienstverband_id`),
  KEY `dienstverband_id` (`dienstverband_id`),
  CONSTRAINT `bedrijf_dienstverbanden_ibfk_1` FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven` (`bedrijf_id`) ON DELETE CASCADE,
  CONSTRAINT `bedrijf_dienstverbanden_ibfk_2` FOREIGN KEY (`dienstverband_id`) REFERENCES `dienstverbanden` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel voor speeddate-evenementen
DROP TABLE IF EXISTS `speeddates`;
CREATE TABLE `speeddates` (
  `speeddate_id` int NOT NULL AUTO_INCREMENT,
  `bedrijf_id` int DEFAULT NULL,
  `datum` date NOT NULL,
  `locatie` varchar(255) DEFAULT NULL,
  `max_deelnemers` int DEFAULT NULL,
  PRIMARY KEY (`speeddate_id`),
  KEY `bedrijf_id` (`bedrijf_id`),
  CONSTRAINT `speeddates_ibfk_1` FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven` (`bedrijf_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel voor de tijdsloten van een speeddate
DROP TABLE IF EXISTS `tijdsloten`;
CREATE TABLE `tijdsloten` (
  `tijdslot_id` int NOT NULL AUTO_INCREMENT,
  `speeddate_id` int DEFAULT NULL,
  `start_tijd` time NOT NULL,
  `eind_tijd` time NOT NULL,
  `is_gereserveerd` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`tijdslot_id`),
  KEY `speeddate_id` (`speeddate_id`),
  CONSTRAINT `tijdsloten_ibfk_1` FOREIGN KEY (`speeddate_id`) REFERENCES `speeddates` (`speeddate_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel voor reserveringen
DROP TABLE IF EXISTS `reservaties`;
CREATE TABLE `reservaties` (
  `reservatie_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `tijdslot_id` int DEFAULT NULL,
  `status` enum('bevestigd','geannuleerd') DEFAULT 'bevestigd',
  `reservatie_datum` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservatie_id`),
  UNIQUE KEY `student_tijdslot_unique` (`student_id`,`tijdslot_id`),
  KEY `tijdslot_id` (`tijdslot_id`),
  CONSTRAINT `reservaties_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `gebruikers` (`gebruiker_id`) ON DELETE CASCADE,
  CONSTRAINT `reservaties_ibfk_2` FOREIGN KEY (`tijdslot_id`) REFERENCES `tijdsloten` (`tijdslot_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel voor notificaties
DROP TABLE IF EXISTS `notificaties`;
CREATE TABLE `notificaties` (
  `notificatie_id` int NOT NULL AUTO_INCREMENT,
  `gebruiker_id` int DEFAULT NULL,
  `bedrijf_id` int DEFAULT NULL,
  `bericht` text NOT NULL,
  `is_gelezen` tinyint(1) DEFAULT '0',
  `creatie_datum` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('info','succes','waarschuwing','fout') DEFAULT 'info',
  PRIMARY KEY (`notificatie_id`),
  KEY `gebruiker_id` (`gebruiker_id`),
  KEY `bedrijf_id` (`bedrijf_id`),
  CONSTRAINT `notificaties_ibfk_1` FOREIGN KEY (`gebruiker_id`) REFERENCES `gebruikers` (`gebruiker_id`) ON DELETE CASCADE,
  CONSTRAINT `notificaties_ibfk_2` FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven` (`bedrijf_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

