const express = require('express');
const cors = require('cors');
const db = require('./db');
/* const fs = require('fs');  verwijder dit niet het leest de josn file  */

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/api/bedrijven', (req, res) => {
  db.query('SELECT naam, bedrijf_URL FROM bedrijven', (err, results) =>{
    if(err) return res.status(500).json({error: 'Database error'});
    res.json(results);
  });
}); 



app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});


//    Opmerking verwijder niet deze script want ik gaan dat later hergebruiken


// data importeren van bedrijvenlijst.json en deze in databank opslaan
/*const data =JSON.parse(fs.readFileSync('bedrijvenlijst.json', 'utf8'));
 
data.forEach(bedrijf => {
  const { name, url, doelgroep_jaar, doelgroep_opleiding, aanbiedingen } = bedrijf; 

  const inserBedijf = `INSERT INTO bedrijven (naam, bedrijf_URL) VALUES (?, ?)`;
  
  db.query(inserBedijf, [name, url], (err, result) =>{
    if(err){
      console.error('fout bij invoegen bedrijf: ', name, err);
      return;
    }

    const bedrijfId = result.insertId;

    doelgroep_jaar.forEach(jaar => {
      db.query(
      `INSERT INTO bedrijf_doelgroep_jaar (bedrijf_id, jaar) VALUES (?, ?)`,
      [bedrijfId, jaar]
      );
    });

    doelgroep_opleiding.forEach(opleiding => {
      db.query(
        `INSERT INTO bedrijf_doelgroep_opl (bedrijf_id, opleiding) VALUES (?, ?)`,
        [bedrijfId, opleiding]
      );
    });

    aanbiedingen.forEach(type => {
      db.query(
        `INSERT INTO bedrijven_aanbiedingen (bedrijf_id, type) VALUES (?, ?)`,
        [bedrijfId, type]
      );
    });

    const sqlSpeeddates = `INSERT INTO speeddates (bedrijf_id, is_bezet) VALUES (?, ?)`;
    db.query(sqlSpeeddates, [bedrijfId, bedrijf.speeddates], (err) => {
      if (err) throw err;
    });
    

  });

console.log(`ingevoegd: ${name}`);
});
*/
