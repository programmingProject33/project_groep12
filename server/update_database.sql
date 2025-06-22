-- Update database to add linkedin column to gebruikers table
USE careerlaunch;

-- Add linkedin column to existing gebruikers table if it doesn't exist
ALTER TABLE gebruikers ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);

-- Verify the column was added
DESCRIBE gebruikers;

-- Dit script is ontworpen om een bestaande database, die de oude structuur volgt,
-- bij te werken naar de nieuwe structuur met de genormaliseerde 'dienstverbanden' tabellen.
-- Het is veilig om dit script meerdere keren uit te voeren; het controleert of de wijzigingen al zijn doorgevoerd.

USE `careerlaunch`;

-- Stap 1: Creëer en vul de master tabel voor dienstverbanden
CREATE TABLE IF NOT EXISTS `dienstverbanden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naam` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naam_unique` (`naam`)
) ENGINE=InnoDB;

-- Vul de tabel alleen als deze leeg is
INSERT IGNORE INTO `dienstverbanden` (`naam`) VALUES
('Stage'),
('Voltijds'),
('Deeltijds'),
('Freelance'),
('Studentenjob');

-- Stap 2: Pas de 'bedrijven' tabel aan
-- Hernoem 'zoeken_we' naar 'gezochte_opleidingen' als de kolom bestaat
ALTER TABLE `bedrijven` CHANGE COLUMN `zoeken_we` `gezochte_opleidingen` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'Door komma gescheiden lijst van opleidingen waar het bedrijf naar zoekt.';

-- Voeg 'gezocht_profiel_omschrijving' toe als de kolom nog niet bestaat
ALTER TABLE `bedrijven` ADD COLUMN IF NOT EXISTS `gezocht_profiel_omschrijving` TEXT NULL COMMENT 'Omschrijving van het profiel dat het bedrijf zoekt.' AFTER `gezochte_opleidingen`;

-- Stap 3: Creëer de nieuwe koppeltabellen
CREATE TABLE IF NOT EXISTS `student_dienstverbanden` (
  `gebruiker_id` int NOT NULL,
  `dienstverband_id` int NOT NULL,
  PRIMARY KEY (`gebruiker_id`,`dienstverband_id`),
  KEY `dienstverband_id` (`dienstverband_id`),
  CONSTRAINT `student_dienstverbanden_ibfk_1` FOREIGN KEY (`gebruiker_id`) REFERENCES `gebruikers` (`gebruiker_id`) ON DELETE CASCADE,
  CONSTRAINT `student_dienstverbanden_ibfk_2` FOREIGN KEY (`dienstverband_id`) REFERENCES `dienstverbanden` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `bedrijf_dienstverbanden` (
  `bedrijf_id` int NOT NULL,
  `dienstverband_id` int NOT NULL,
  PRIMARY KEY (`bedrijf_id`,`dienstverband_id`),
  KEY `dienstverband_id` (`dienstverband_id`),
  CONSTRAINT `bedrijf_dienstverbanden_ibfk_1` FOREIGN KEY (`bedrijf_id`) REFERENCES `bedrijven` (`bedrijf_id`) ON DELETE CASCADE,
  CONSTRAINT `bedrijf_dienstverbanden_ibfk_2` FOREIGN KEY (`dienstverband_id`) REFERENCES `dienstverbanden` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Stap 4: Migreer de data uit de oude 'dienstverbanden' kolommen
-- Deze data was vaak een JSON-achtige string zoals ["Stage", "Voltijds"]
-- We moeten deze opschonen en de correcte IDs opzoeken.

-- Migratie voor bedrijven
INSERT INTO bedrijf_dienstverbanden (bedrijf_id, dienstverband_id)
SELECT b.bedrijf_id, d.id
FROM bedrijven b
JOIN dienstverbanden d ON 
  -- Verwijder speciale tekens en zoek naar de naam van het dienstverband
  REPLACE(REPLACE(REPLACE(b.dienstverbanden, '[', ''), ']', ''), '"', '') LIKE CONCAT('%', d.naam, '%')
-- Voorkom duplicaten als de migratie opnieuw wordt uitgevoerd
ON DUPLICATE KEY UPDATE bedrijf_id=b.bedrijf_id;

-- Migratie voor studenten
INSERT INTO student_dienstverbanden (gebruiker_id, dienstverband_id)
SELECT g.gebruiker_id, d.id
FROM gebruikers g
JOIN dienstverbanden d ON 
  REPLACE(REPLACE(REPLACE(g.dienstverbanden, '[', ''), ']', ''), '"', '') LIKE CONCAT('%', d.naam, '%')
ON DUPLICATE KEY UPDATE gebruiker_id=g.gebruiker_id;


-- Stap 5: Verwijder de oude kolommen nadat de data is gemigreerd
-- Controleer eerst of de kolom bestaat voordat je hem verwijdert
ALTER TABLE `gebruikers` DROP COLUMN IF EXISTS `dienstverbanden`;
ALTER TABLE `bedrijven` DROP COLUMN IF EXISTS `dienstverbanden`;

-- Geef een melding dat het script is voltooid.
SELECT 'Database update script succesvol uitgevoerd.' AS 'Status'; 