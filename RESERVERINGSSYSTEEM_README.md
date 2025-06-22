# Reserveringssysteem - Career Launch

## Overzicht

Het nieuwe reserveringssysteem voor Career Launch vervangt het oude directe reserveringssysteem met een workflow-gebaseerd systeem waarbij bedrijven controle hebben over welke reserveringen ze accepteren. Het systeem ondersteunt verschillende statussen, e-mailnotificaties en de mogelijkheid om alternatieve tijdsloten voor te stellen.

## Hoe het werkt

### Workflow

1. **Student maakt reservering** → Status: `pending`
2. **Bedrijf ontvangt notificatie** → Kan kiezen uit:
   - ✅ **Accepteren** → Status: `accepted`
   - ❌ **Afwijzen** → Status: `rejected` (met reden)
   - 🔄 **Alternatief voorstellen** → Status: `alternative`
3. **Student reageert op alternatief** → Kan accepteren of weigeren
4. **E-mailnotificaties** worden automatisch verzonden bij elke statuswijziging

### Statussen

- **`pending`** - Reservering wacht op bevestiging van het bedrijf
- **`accepted`** - Reservering is geaccepteerd door het bedrijf
- **`rejected`** - Reservering is afgewezen door het bedrijf
- **`alternative`** - Bedrijf heeft een alternatief tijdslot voorgesteld

## Database Schema

### Reserveringen Tabel

```sql
CREATE TABLE reserveringen (
    reservering_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    bedrijf_id INT NOT NULL,
    speed_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'alternative') DEFAULT 'pending',
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    alternative_speed_id INT NULL,
    FOREIGN KEY (student_id) REFERENCES gebruikers(gebruiker_id),
    FOREIGN KEY (bedrijf_id) REFERENCES bedrijven(bedrijf_id),
    FOREIGN KEY (speed_id) REFERENCES speeddates(speed_id),
    FOREIGN KEY (alternative_speed_id) REFERENCES speeddates(speed_id)
);
```

### Belangrijke velden:
- `status` - Huidige status van de reservering
- `rejection_reason` - Reden van afwijzing (optioneel)
- `alternative_speed_id` - ID van het voorgestelde alternatieve tijdslot
- `created_at` / `updated_at` - Timestamps voor tracking

## Backend Implementatie

### API Endpoints

#### 1. Nieuwe Reservering Maken
```http
POST /api/reserveren
Content-Type: application/json

{
  "student_id": 123,
  "bedrijf_id": 456,
  "speed_id": 789
}
```

**Functionaliteit:**
- Controleert of student al een reservering heeft bij dit bedrijf
- Controleert op tijdsconflicten
- Maakt reservering aan met status 'pending'
- Markeert tijdslot als bezet
- Verstuurt e-mailnotificatie naar bedrijf

#### 2. Reserveringen Ophalen (Student)
```http
GET /api/reservaties/:studentId
```

**Retourneert:**
- Alle reserveringen van de student
- Inclusief bedrijfsinformatie en tijdsloten
- Alternatieve tijdsloten indien van toepassing

#### 3. Reserveringen Ophalen (Bedrijf)
```http
GET /api/bedrijf/reservaties/:bedrijfId
```

**Retourneert:**
- Alle reserveringen voor het bedrijf
- Inclusief studentinformatie en tijdsloten
- Alternatieve tijdsloten indien van toepassing

#### 4. Reservering Accepteren
```http
POST /api/reservaties/:reserveringId/accepteren
```

**Functionaliteit:**
- Update status naar 'accepted'
- Verstuurt e-mailnotificatie naar student

#### 5. Reservering Afwijzen
```http
POST /api/reservaties/:reserveringId/afwijzen
Content-Type: application/json

{
  "rejection_reason": "Reden van afwijzing"
}
```

**Functionaliteit:**
- Update status naar 'rejected'
- Slaat afwijzingsreden op
- Maakt tijdslot weer beschikbaar
- Verstuurt e-mailnotificatie naar student

#### 6. Alternatief Tijdslot Voorstellen
```http
POST /api/reservaties/:reserveringId/alternatief
Content-Type: application/json

{
  "alternative_speed_id": 999
}
```

**Functionaliteit:**
- Update status naar 'alternative'
- Slaat alternatief tijdslot op
- Markeert alternatief tijdslot als bezet
- Verstuurt e-mailnotificatie naar student

#### 7. Student Antwoordt op Alternatief
```http
POST /api/reservaties/:reserveringId/alternatief-antwoord
Content-Type: application/json

{
  "accepted": true
}
```

**Functionaliteit:**
- Als geaccepteerd: status naar 'accepted'
- Als geweigerd: status naar 'rejected', beide tijdsloten vrijgeven
- Verstuurt e-mailnotificatie naar bedrijf

#### 8. Reservering Annuleren
```http
DELETE /api/reservaties/:reserveringId
```

**Functionaliteit:**
- Verwijdert reservering uit database
- Maakt alle gerelateerde tijdsloten vrij
- Alleen mogelijk voor 'pending' en 'alternative' statussen

### E-mailnotificaties

Het systeem verstuurt automatisch e-mailnotificaties bij elke statuswijziging:

1. **Nieuwe reservering** → Bedrijf ontvangt notificatie
2. **Reservering geaccepteerd** → Student ontvangt bevestiging
3. **Reservering afgewezen** → Student ontvangt afwijzing met reden
4. **Alternatief voorgesteld** → Student ontvangt voorstel
5. **Alternatief beantwoord** → Bedrijf ontvangt reactie

## Frontend Implementatie

### Studenten Interface

#### Reservaties.jsx
- **Status badges** met kleurcodering
- **Alternatieve voorstellen** worden duidelijk getoond
- **Actieknoppen** op basis van status:
  - `alternative` status: Accepteren/Weigeren knoppen
  - `pending`/`alternative` status: Annuleren knop
- **Afwijzingsredenen** worden getoond in rode box
- **Alternatieve tijden** worden getoond in gele box

#### SpeeddatePage.jsx
- Gebruikt nieuwe `/api/reserveren` endpoint
- Toont melding dat reservering wacht op bevestiging
- Navigeert naar reserveringenpagina na succesvolle reservering

### Bedrijven Interface

#### reservatieBedrijf.jsx
- **Status kolom** met badges voor alle reserveringen
- **Actiekolom** met knoppen op basis van status:
  - `pending`/`alternative`: Accepteren, Afwijzen knoppen
  - `pending`: Alternatief voorstellen knop
- **Modal voor afwijzing** met tekstveld voor reden
- **Modal voor alternatief** met lijst van beschikbare tijdsloten
- **Loading states** tijdens acties

## Migratie van Oud Systeem

### Database Migratie
Het migratiescript `migrate_to_new_reservation_system.js` heeft:
1. De `reserveringen` tabel aangemaakt
2. Alle bestaande reserveringen overgezet
3. Status op 'accepted' gezet voor bestaande reserveringen
4. Tijdsloten gemarkeerd als bezet

### Code Migratie
- Oude `/api/speeddate` endpoint vervangen door `/api/reserveren`
- Oude `/api/reservations` endpoint vervangen door `/api/reservaties`
- Frontend aangepast om nieuwe endpoints te gebruiken
- UI uitgebreid met status- en actie-elementen

## Gebruiksinstructies

### Voor Studenten

1. **Reservering maken:**
   - Ga naar bedrijfspagina
   - Selecteer beschikbaar tijdslot
   - Klik "Bevestig reservering"
   - Reservering krijgt status "Wacht op bevestiging"

2. **Reserveringen bekijken:**
   - Ga naar "Mijn Reserveringen"
   - Zie status van alle reserveringen
   - Voor alternatieve voorstellen: klik Accepteren/Weigeren
   - Voor afgewezen reserveringen: zie reden van afwijzing

3. **Reservering annuleren:**
   - Alleen mogelijk voor "Wacht op bevestiging" status
   - Klik op prullenbak-icoon

### Voor Bedrijven

1. **Reserveringen bekijken:**
   - Ga naar "Reservaties" pagina
   - Zie alle reserveringen met status
   - Klik op studentnaam voor details

2. **Reservering accepteren:**
   - Klik "✅ Accepteren" knop
   - Student ontvangt automatisch bevestiging

3. **Reservering afwijzen:**
   - Klik "❌ Afwijzen" knop
   - Vul reden in en klik "Afwijzen"
   - Student ontvangt automatisch afwijzing met reden

4. **Alternatief voorstellen:**
   - Klik "🔄 Alternatief" knop
   - Selecteer beschikbaar tijdslot
   - Student ontvangt automatisch voorstel

## Technische Details

### Beveiliging
- Alle endpoints valideren input
- Controle op dubbele reserveringen
- Controle op tijdsconflicten
- Alleen geldige statustransities toegestaan

### Performance
- Database queries geoptimaliseerd met JOINs
- E-mailnotificaties verstuurd op achtergrond
- Loading states in frontend voor betere UX

### Foutafhandeling
- Duidelijke foutmeldingen voor gebruikers
- Logging van alle acties
- Graceful degradation bij e-mailfouten

## Toekomstige Uitbreidingen

Mogelijke verbeteringen voor de toekomst:
- Notificaties in de browser (push notifications)
- Automatische herinneringen voor speeddates
- Dashboard met statistieken voor bedrijven
- Bulk-acties voor bedrijven (meerdere reserveringen tegelijk)
- Export functionaliteit voor reserveringen

## Troubleshooting

### Veelvoorkomende Problemen

1. **"Reservering kan niet meer geaccepteerd worden"**
   - Controleer of de status nog 'pending' of 'alternative' is
   - Alleen deze statussen kunnen geaccepteerd worden

2. **"Alternatief tijdslot is niet beschikbaar"**
   - Het geselecteerde tijdslot is al bezet
   - Kies een ander beschikbaar tijdslot

3. **E-mailnotificaties komen niet aan**
   - Controleer e-mailconfiguratie in `.env`
   - Controleer spam folder
   - E-mailfouten worden gelogd in server console

4. **"Je hebt al een reservering bij dit bedrijf"**
   - Annuleer eerst bestaande reservering
   - Of wacht tot deze wordt afgewezen

### Debugging

- Controleer browser console voor frontend fouten
- Controleer server logs voor backend fouten
- Gebruik database queries om reserveringsstatus te controleren
- Test e-mailfunctionaliteit met test account

## Conclusie

Het nieuwe reserveringssysteem biedt een complete workflow voor het beheren van speeddate reserveringen, met volledige controle voor bedrijven en transparantie voor studenten. Het systeem is schaalbaar, gebruiksvriendelijk en ondersteunt alle benodigde functionaliteiten voor een professioneel speeddate evenement.
