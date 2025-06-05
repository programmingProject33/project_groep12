const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
/*app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/data', (req, res) => {
  res.json({ 
    data: 'Dit is data van de Express server',
    timestamp: new Date().toISOString()
  });
}); */

// test
app.get('/', (req, res) => {
  res.send('hallo world')
  
})
// test 
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
