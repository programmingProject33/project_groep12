const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/api/bedrijven', (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) =>{
    if(err) return res.status(500).json({error: 'Database error'});
    res.json(results);
  });
});

/*app.get('/api/data', (req, res) => {
  res.json({ 
    data: 'Dit is data van de Express server',
    timestamp: new Date().toISOString()
  });
}); 


app.get('/', (req, res) => {
  res.send('hallo world')
  
})*/
 
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
