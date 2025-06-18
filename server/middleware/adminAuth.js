const jwt = require('jsonwebtoken');
require('dotenv').config();

const authAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Geen token opgegeven' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Ongeldige of verlopen token' });
  }
};

module.exports = authAdmin;













// const jwt = require('jsonwebtoken');

// const adminAuth = (req, res, next) => {
//     try {
//         // Haal token uit Authorization header
//         const authHeader = req.header('Authorization');
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Geen token voorzien of onjuist formaat' });
//         }

//         const token = authHeader.replace('Bearer ', '');

//         // Verifieer token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Controleer of het een geldige admin rol is
//         const toegestaneRollen = ['superadmin']; // Voeg hier eventueel 'admin' aan toe als je later meerdere rollen wilt
//         if (!toegestaneRollen.includes(decoded.role)) {
//             return res.status(403).json({ message: 'Geen admin rechten' });
//         }

//         // Voeg admin info toe aan request
//         req.admin = decoded;
//         next();

//     } catch (error) {
//         console.error('Authenticatie fout:', error.message);
//         res.status(401).json({ message: 'Token is ongeldig of verlopen' });
//     }
// };

// module.exports = adminAuth;
