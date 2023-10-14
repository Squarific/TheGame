const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const crypto = require('crypto'); 
const cors = require('cors');
const app = express();
const port = 3000;

const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, passphrase TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS abilities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS users_abilities (userid INTEGER, abilityid INTEGER, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(abilityid) REFERENCES abilities(id))');
  db.run('CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, item TEXT, quantity INTEGER, FOREIGN KEY(userid) REFERENCES users(id))');
  
  db.run("INSERT INTO abilities (name) SELECT 'CollectLove' WHERE NOT EXISTS(SELECT 1 FROM abilities WHERE name = 'CollectLove')", (err) => {
    if (err) {
      console.error('Error adding ability', err);
    }
  });

});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// This endpoint will return a list of available abilities.
app.get('/abilities', (req, res) => {
  db.all('SELECT * FROM abilities', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } 

    if (rows) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: 'Abilities not found' });
    }
  });
});

app.post('/register', (req, res) => {
  let { name, abilities } = req.body;
    
  abilities = JSON.parse(abilities);
  if (!Array.isArray(abilities)) {
      console.error('Abilities not an array:', abilities);
      res.status(500).json({ error: 'Internal Server Error: Abilities must be an array.' });
      return;
  }

  const passphrase = crypto.randomBytes(16).toString('hex');

  db.run('INSERT INTO users (name, passphrase) VALUES (?, ?)', [name, passphrase], (err) => {
    if (err) {
      console.error('Error registering user', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Insert abilities into users_abilities table
    abilities.forEach(ability => {
      db.run('INSERT INTO users_abilities (userid, abilityid) VALUES ((SELECT id FROM users WHERE passphrase = ?), ?)',
        [passphrase, ability], (err) => {
          if (err) {
            console.error('Error assigning abilities', err);
          }
        });
    });

    res.status(201).json({ passphrase: passphrase });
  });
});

app.get('/login/:passphrase', (req, res) => {
  db.get('SELECT name FROM users WHERE passphrase = ?', [req.params.passphrase], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  });
});

app.get('/abilities/:passphrase', (req, res) => {
  db.all('SELECT a.name FROM abilities a JOIN users_abilities ua ON a.id = ua.abilityid JOIN users u ON u.id = ua.userid WHERE u.passphrase = ?', [req.params.passphrase], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (rows) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  });
});

app.post('/collectLove/:passphrase', (req, res) => {
  db.run('INSERT INTO inventory (userid, item, quantity) VALUES ((SELECT id FROM users WHERE passphrase = ?), "heart", 1)', [req.params.passphrase], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'Heart added to your inventory' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
