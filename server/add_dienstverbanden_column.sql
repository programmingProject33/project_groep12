-- Dit script voegt de ontbrekende 'dienstverbanden' kolom toe aan de 'gebruikers' tabel.
-- Voer dit script uit op je database om de registratiefout te verhelpen.

ALTER TABLE `gebruikers`
ADD COLUMN `dienstverbanden` TEXT NULL AFTER `linkedin`; 