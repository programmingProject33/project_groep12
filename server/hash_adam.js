const bcrypt = require('bcrypt');

bcrypt.hash('adam123', 10).then(hash => {
  console.log('Hash voor adam123:', hash);
}); 