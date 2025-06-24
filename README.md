# 🎓 Career Launch Speeddate Website

Welkom bij **Career Launch**, het reserveringsplatform voor speeddates tussen studenten en bedrijven tijdens de Career Launch Beurs. Ons doel is om gerichte, waardevolle connecties te faciliteren tussen jong talent en innovatieve werkgevers in een moderne en gebruiksvriendelijke digitale omgeving.

---

## 👨‍💻 Team

Dit project is ontwikkeld door studenten van EhB:

- **MEZIANI Bilal**
- **IBRAHIM SHEXO Mohammad**
- **LODHI Mutahir**
- **ASSARAR Nisrine**

Met ondersteuning van tools zoals **Figma**, **Trello**, **GitHub** en **ChatGPT** (voor tekstverfijning en documentatie).

---

## 🎯 Doel van het project

Een moderne webapplicatie waarmee:
- 👥 Studenten zich kunnen registreren en speeddates reserveren bij bedrijven
- 🏢 Bedrijven hun profiel en beschikbare tijdsloten beheren
- 🛠️ Organisatoren het overzicht behouden via een krachtig admin-dashboard

---

## ✨ Functionaliteiten

- ✅ Registratie + login (student, bedrijf, admin) met e-mailverificatie
- ✅ Automatische tijdslotgeneratie voor bedrijven
- ✅ Filters + zoekfuncties voor studenten & bedrijven
- ✅ Reserveringsbeheer met bevestiging via e-mail
- ✅ Admin-dashboard met statistieken & beheerfuncties
- ✅ Uploads: CV, motivatiebrief, LinkedIn
- ✅ Fout- en succesmeldingen bij alle belangrijke acties
- ✅ 404-pagina voor niet-bestaande routes
- ✅ Responsive design & moderne UI

---

## 🧑‍💻 Voor wie?

### 🧑 Studenten
- Registreren als student
- Reserveren van speeddate-afspraken
- Annuleren van afspraken
- Beheren van profiel & documenten (CV, motivatiebrief, LinkedIn)

### 🏢 Bedrijven
- Registreren als bedrijf
- Automatisch tijdsloten beheren
- Profielen van studenten bekijken
- Reserveringen bekijken en opvolgen

### 🛠️ Organisatoren/Admins
- Goedkeuren of afwijzen van bedrijfsaanvragen
- Studenten- en bedrijfsgegevens beheren
- Reserveringsbeheer & dashboard met overzichten
- Wachtwoordreset-systeem voor admins

---

## 🛠 Installatie & Opstart

### Vereisten
- Node.js (v18 of hoger)
- MySQL (met phpMyAdmin of CLI)
- `.env` bestand in de `server/` map (zie `.env.example`)

### Installatiestappen

1. Clone de repository:
   ```bash
   git clone https://github.com/programmingProject33/project_groep12.git
   ```

**Frontend installeren & starten:**
```bash
cd client
npm install
npm run dev
```

**Backend installeren & starten:**
```bash
cd ../server
npm install
npm run dev
```

**Database instellen:**
- Maak een MySQL database aan met naam `careerlaunch`
- Importeer het bestand `server/database.sql`
- Maak een `.env` bestand aan in `server/` met:
```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=jeWachtwoord
DB_NAME=careerlaunch
JWT_SECRET=geheimesleutel
EMAIL_USER=example@mail.com
EMAIL_PASS=jeMailWachtwoord
```

Gebruik `http://localhost:5173` voor de frontend en `http://localhost:5000` voor de backend.

---

## 📂 Projectstructuur
```
project-root/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── voor-inloggen/     # Publieke pagina's (login, registratie, home, bedrijven)
│   │   ├── inloggen-student/  # Student specifieke pagina's
│   │   ├── inloggen-bedrijf/  # Bedrijf specifieke pagina's
│   │   ├── pages/             # Algemene pagina's (verificatie, etc.)
│   │   ├── AuthContext.jsx    # Auth context
│   │   └── App.jsx            # Routing
│
├── server/                # Backend (Node.js + Express)
│   ├── routes/                # API-routes (gebruikers, bedrijven, reservaties, admin)
│   ├── db.js                  # MySQL connectie
│   ├── server.js              # Hoofdserver
│   ├── mailer.js              # E-mail functionaliteit
│   └── database.sql           # SQL dump
│
├── .env.example           # Voorbeeld .env-config
└── README.md              # Projectdocumentatie (dit bestand)
```

---

## 👥 Testaccounts
| Rol | Gebruikersnaam | Wachtwoord |
|-----|----------------|------------|
| Student | student1 | student123 |
| Bedrijf | bedrijf1 | bedrijf123 |
| Admin | admin | admin123 |

Je kunt ook zelf registreren via de registratiepagina op de website.

---

## 🔐 Admin Functionaliteit

### Admin login & beheer
Admins loggen in via een aparte loginpagina. Na inloggen hebben ze toegang tot een uitgebreid dashboard met beheerfuncties voor bedrijven, studenten, dienstverbanden, reserveringen en statistieken. Enkel superadmins kunnen nieuwe admins beheren.
#### Bij admin frontend installeert u de volgende freameworks:
- npm install
- Vite + React 
- npm install @emailjs/browser, indien nodig installeer emailjs om email te kunnen sturen naar de aangemaakte admin
### Belangrijke Admin API-routes
- **POST /api/admin/login** – Inloggen als admin
- **GET/POST/DELETE /api/admin/admins** – Admins beheren (alleen superadmin)
- **GET /api/admin/bedrijven** – Overzicht bedrijven
- **GET /api/admin/studenten** – Overzicht studenten
- **GET /api/admin/speeddates** – Overzicht speeddates
- **GET/PUT /api/admin/dienstverbanden** – Dienstverbanden beheren
- **GET /api/admin/stats** – Statistieken

---

## ❓ Veelgestelde vragen

**1. Geen e-mail ontvangen bij registratie/verificatie?**
- Controleer je spamfolder.
- Check je SMTP-instellingen in `.env`.

**2. Databasefout bij opstarten?**
- Zorg dat MySQL draait en dat je `server/database.sql` hebt geïmporteerd.

**3. Hoe reset ik een wachtwoord?**
- Admins gebruiken "Wachtwoord vergeten" op de inlogpagina.

**4. Hoe debug ik fouten?**
- Gebruik `console.log()` in frontend/backend.
- Bekijk de browserconsole (F12 > Console) en netwerkverkeer.

---

## 📩 Contact
Voor vragen, foutmeldingen of samenwerking:

📧 support-careerlaunch@ehb.be
📍 Nijverheidskaai 170, 1070 Anderlecht


