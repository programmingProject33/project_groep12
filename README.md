# CareerLaunch Reserveringsplatform

## 🧾 Inhoud
- [Introductie](#introductie)
- [✨ Features](#-features)
- [🧑‍💻 Installatie & Opstart](#-installatie--opstart)
- [📂 Structuur van het project](#-structuur-van-het-project)
- [👥 Testaccounts](#-testaccounts)
- [🛠 Developer info](#-developer-info)
- [❓ Veelgestelde vragen](#-veelgestelde-vragen)

---

## 🧠 Introductie
CareerLaunch is een reserveringsplatform voor speeddates tussen studenten en bedrijven. Studenten kunnen zich aanmelden voor tijdsloten bij bedrijven, bedrijven beheren hun eigen tijdsloten en reserveringen, en beheerders (admins) houden overzicht via een admin-dashboard. Het platform is bedoeld voor gebruik door studenten, bedrijven en beheerders van een hogeschool of universiteit.

---

## ✨ Features
- **Registratie & login** (met e-mailverificatie)
- **Studentenlijst** met krachtige filters en zoekfunctie (voornaam, opleiding, dienstverband)
- **Reserveringsmodule** per tijdslot (studenten reserveren, bedrijven beheren)
- **Bedrijven-dashboard** met overzicht van reserveringen
- **Admin-paneel** voor beheer van gebruikers, bedrijven, dienstverbanden en statistieken
- **Automatisch aanmaken van tijdsloten** voor bedrijven
- **E-mailnotificaties** bij registratie, verificatie en reserveringen
- **Feedback en foutmeldingen** bij alle belangrijke acties
- **404-pagina** voor niet-bestaande routes

---

## 🧑‍💻 Installatie & Opstart

### 🔗 1. Vereisten
- Node.js (v18 of hoger)
- MySQL (of phpMyAdmin)
- (optioneel) Nodemailer / SMTP-server voor e-mailverificatie

### 📂 2. Projectstructuur
```
project-root/
├── client/       → Frontend (Vite + React)
├── server/       → Backend (Node.js + Express)
├── server/database.sql  → Database structuur/dump
├── .env.example  → Voorbeeld van de vereiste .env-config
```

### ⚙️ 3. Configuratie
1. Maak een `.env` bestand aan in de map `server/` (gebruik `.env.example` als sjabloon).
2. Vul de volgende velden in:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `EMAIL_USER`, `EMAIL_PASS` (voor e-mailverificatie)
   - `JWT_SECRET` (voor authenticatie)

### ▶️ 4. Website starten
**Backend starten:**
```bash
cd server
npm install
npm run dev
```
**Frontend starten:**
```bash
cd client
npm install
npm run dev
```
De site draait op:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

Gebruik [http://localhost:5173](http://localhost:5173) om de app te testen.

---

## 📂 Structuur van het project
```
project-root/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── voor-inloggen/     # Publieke pagina's (login, registratie, home, bedrijven)
│   │   ├── inloggen-student/  # Student specifieke pagina's
│   │   ├── inloggen-bedrijf/  # Bedrijf specifieke pagina's
│   │   ├── pages/             # Algemene pagina's (verificatie, etc.)
│   │   ├── AuthContext.jsx    # Auth context
│   │   └── App.jsx           # Routing
│   └── ...
├── server/                # Backend (Node.js + Express)
│   ├── routes/                # API-routes (gebruikers, bedrijven, reservaties, admin, ...)
│   ├── db.js                  # Database connectie
│   ├── mailer.js              # E-mail functionaliteit
│   ├── server.js              # Hoofdserver
│   └── database.sql           # Database structuur
├── .env.example           # Voorbeeld .env-config
└── README.md              # Deze handleiding
```

---

## 👥 Testaccounts
| Rol      | Gebruikersnaam | Wachtwoord  |
|----------|----------------|-------------|
| Student  | student1       | student123  |
| Bedrijf  | bedrijf1       | bedrijf123  |
| Admin    | admin          | admin123    |

Je kunt ook zelf registreren via de registratiepagina.

---

## 🛠 Developer info
- **API-routes** vind je in `server/routes/` (gebruikers, bedrijven, reservaties, admin, ...)
- **Database**: structuur staat in `server/database.sql`. Gebruik deze om de MySQL database aan te maken.
- **Tijdsloten** worden automatisch aangemaakt voor bedrijven na registratie.
- **E-mail**: wordt verstuurd via Nodemailer (SMTP-configuratie vereist in `.env`).
- **Login**: JWT-authenticatie, tokens worden opgeslagen in localStorage.
- **Foutmeldingen**: worden getoond in de UI, en zijn zichtbaar in de browserconsole (F12 > Console).
- **Debugging**: Gebruik `console.log` in de frontend/backend, en de Network-tab in de browser voor API-verkeer.
- **404-pagina**: Niet-bestaande routes tonen een nette foutpagina.

---

## ❓ Veelgestelde vragen
**1. Ik krijg geen e-mail bij registratie/verificatie?**
- Controleer je SMTP-instellingen in `.env`.
- Kijk in je spamfolder.

**2. Databasefout bij opstart?**
- Controleer of MySQL draait en de database correct is aangemaakt met `server/database.sql`.

**3. Hoe reset ik een wachtwoord?**
- Neem contact op met de admin of implementeer een wachtwoord-resetfunctie.

**4. Hoe debug ik fouten?**
- Bekijk de browserconsole (F12) en de Network-tab voor API-verkeer.
- Check de backend logs in de terminal.

---

Veel succes met CareerLaunch! 🚀


