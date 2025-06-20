# Database Update Instructies

## LinkedIn Kolom Toevoegen

Om ervoor te zorgen dat LinkedIn profielen correct worden opgeslagen en weergegeven, moet de database worden bijgewerkt.

### Stap 1: Database Update Uitvoeren

Voer het volgende SQL commando uit in je MySQL database:

```sql
USE careerlaunch;
ALTER TABLE gebruikers ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
```

Of voer het bestand `update_database.sql` uit:

```bash
mysql -u [username] -p < update_database.sql
```

### Stap 2: Verificatie

Controleer of de kolom is toegevoegd:

```sql
DESCRIBE gebruikers;
```

Je zou nu de `linkedin` kolom moeten zien in de tabel structuur.

### Wat is er gewijzigd?

1. **Database**: `linkedin` kolom toegevoegd aan `gebruikers` tabel
2. **Registratie**: LinkedIn URL wordt nu opgeslagen tijdens registratie
3. **Profiel Update**: LinkedIn URL kan nu worden bijgewerkt in het profiel
4. **Profiel Weergave**: LinkedIn URL wordt correct weergegeven in het profiel

### Functionaliteit

- Studenten kunnen nu een LinkedIn profiel URL toevoegen tijdens registratie
- De LinkedIn URL wordt direct zichtbaar in het profiel na registratie
- LinkedIn URL kan worden bewerkt in het profiel
- LinkedIn knop wordt alleen getoond als er een geldige URL is ingevuld 