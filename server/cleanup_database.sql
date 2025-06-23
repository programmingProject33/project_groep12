-- Controleer dubbele gebruikers
SELECT email, COUNT(*) as count FROM gebruikers GROUP BY email HAVING COUNT(*) > 1;
SELECT gebruikersnaam, COUNT(*) as count FROM gebruikers GROUP BY gebruikersnaam HAVING COUNT(*) > 1;
-- Verwijder alle testgebruikers (pas aan naar jouw criteria)
DELETE FROM gebruikers WHERE email LIKE '%test%' OR email LIKE '%example%' OR voornaam LIKE '%test%';
-- Toon overgebleven gebruikers
SELECT COUNT(*) as total_users FROM gebruikers;
