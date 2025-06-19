# Tijdsloten Systeem - Automatische Aanmaak

## Overzicht

Het tijdsloten systeem zorgt ervoor dat alle bedrijven automatisch de juiste speeddate tijdsloten krijgen, zowel voor bestaande als nieuwe bedrijven.

## Hoe het werkt

### Automatische Aanmaak voor Nieuwe Bedrijven

Wanneer een nieuw bedrijf zich registreert via `/api/register`, worden automatisch tijdsloten aangemaakt:

- **Tijdsloten**: 10:00 - 18:00 (10 minuten per slot)
- **Pauzes**: 
  - 11:20 - 11:40
  - 13:00 - 14:00 (lunch)
  - 16:20 - 16:40
- **Status**: Alle tijdsloten beginnen als `is_bezet = 0` (beschikbaar)

### Voor Bestaande Bedrijven

Voor bedrijven die al bestaan maar nog geen tijdsloten hebben, kunnen tijdsloten worden aangemaakt via SQL:

```sql
-- Tijdsloten aanmaken voor alle bedrijven zonder bestaande tijdsloten
INSERT INTO speeddates (bedrijf_id, starttijd, eindtijd, is_bezet, created_at)
SELECT 
    b.bedrijf_id,
    CONCAT('2025-06-20 ', TIME_FORMAT(DATE_ADD('10:00:00', INTERVAL (n-1)*10 MINUTE), '%H:%i:%s')),
    CONCAT('2025-06-20 ', TIME_FORMAT(DATE_ADD('10:00:00', INTERVAL n*10 MINUTE), '%H:%i:%s')),
    0,
    NOW()
FROM bedrijven b
CROSS JOIN (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION
    SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION
    SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION
    SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION
    SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION
    SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION
    SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40 UNION
    SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45 UNION
    SELECT 46 UNION SELECT 47 UNION SELECT 48
) numbers
WHERE NOT EXISTS (
    SELECT 1 FROM speeddates s WHERE s.bedrijf_id = b.bedrijf_id
)
AND TIME_FORMAT(DATE_ADD('10:00:00', INTERVAL (n-1)*10 MINUTE), '%H:%i') NOT IN ('11:20', '11:30', '13:00', '13:10', '13:20', '13:30', '13:40', '13:50', '16:20', '16:30');
```

## Bestanden

### Server-side
- `server/server.js` - Aangepaste registratie functie met automatische tijdsloten

## Gebruik

### Voor Ontwikkelaars

Het systeem werkt volledig automatisch:
- Nieuwe bedrijven krijgen automatisch tijdsloten bij registratie
- Bestaande bedrijven kunnen tijdsloten krijgen via SQL script

### Voor Database Beheer

Om tijdsloten aan te maken voor bestaande bedrijven:
1. Voer het bovenstaande SQL script uit in phpMyAdmin
2. Pas de datum aan in het script indien nodig
3. Controleer of alle bedrijven nu tijdsloten hebben

## Database Schema

De `speeddates` tabel bevat:
- `speed_id` - Unieke ID voor elk tijdslot
- `bedrijf_id` - Verwijzing naar het bedrijf
- `starttijd` - Starttijd van het tijdslot
- `eindtijd` - Eindtijd van het tijdslot
- `is_bezet` - 0 = beschikbaar, 1 = gereserveerd
- `gebruiker_id` - NULL of ID van de student die heeft gereserveerd
- `created_at` - Timestamp van aanmaak

## Tijdslot Schema

```
10:00 - 10:10
10:10 - 10:20
...
11:00 - 11:10
11:10 - 11:20
[PAUZE 11:20 - 11:40]
11:40 - 11:50
11:50 - 12:00
...
12:50 - 13:00
[LUNCH 13:00 - 14:00]
14:00 - 14:10
...
16:10 - 16:20
[PAUZE 16:20 - 16:40]
16:40 - 16:50
...
17:50 - 18:00
```

## Troubleshooting

### Geen tijdsloten voor een bedrijf?
1. Controleer of het bedrijf bestaat in de `bedrijven` tabel
2. Controleer of er tijdsloten zijn in de `speeddates` tabel voor dat bedrijf
3. Voer het SQL script uit om tijdsloten aan te maken

### Fouten bij aanmaken tijdsloten?
1. Controleer de server logs voor database fouten
2. Zorg dat de database verbinding werkt
3. Controleer of de `speeddates` tabel bestaat en correct is gestructureerd

## Toekomstige Verbeteringen

- Mogelijkheid om tijdsloten te verwijderen
- Bulk import van bedrijven met tijdsloten
- Configuratie van tijdslot schema per bedrijf
- Automatische herhaling van tijdsloten voor verschillende dagen 