const db = require('./db');
const bcrypt = require('bcrypt');

async function hashPasswords(table, idField) {
  const [rows] = await db.promise().query(`SELECT ${idField}, wachtwoord FROM ${table}`);
  for (const row of rows) {
    const { [idField]: id, wachtwoord } = row;
    // Sla over als het al een bcrypt-hash is
    if (wachtwoord.startsWith('$2b$') || wachtwoord.startsWith('$2y$')) continue;
    const hash = await bcrypt.hash(wachtwoord, 10);
    await db.promise().query(
      `UPDATE ${table} SET wachtwoord = ? WHERE ${idField} = ?`,
      [hash, id]
    );
    console.log(`Gehashed voor ${table} id ${id}`);
  }
  console.log(`Klaar met ${table}`);
}

(async () => {
  await hashPasswords('gebruikers', 'gebruiker_id');
  await hashPasswords('bedrijven', 'bedrijf_id');
  process.exit(0);
})(); 