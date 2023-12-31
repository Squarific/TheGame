const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const crypto = require('crypto'); 
const cors = require('cors');
const app = express();
const port = 3000;

const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, passphrase TEXT, last_collected DATETIME)');
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
  db.get('SELECT last_collected FROM users WHERE passphrase = ?', [req.params.passphrase], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (user) {
      // Initialize last_collected to the current date-time if it hasn't been set before
      const last_collected = user.last_collected ? new Date(user.last_collected) : new Date();
      const now = new Date();
      const diffMinutes = last_collected ? Math.floor((now - last_collected) / 60000) : 0; // Difference in minutes

      // If difference or last_collected is null (first collect), add one heart, else calculate based on minutes difference
      const heartToAdd = diffMinutes ? Math.floor(diffMinutes * 10) : 1;

      db.run('UPDATE users SET last_collected = ? WHERE passphrase = ?', [now.toISOString(), req.params.passphrase], (err) => {
        if (err) {
          console.error('Error updating last collected time', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        db.run('INSERT INTO inventory (userid, item, quantity) VALUES ((SELECT id FROM users WHERE passphrase = ?), "heart", ?)', [req.params.passphrase, heartToAdd], (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(201).json({ message: `Added ${heartToAdd} hearts to your inventory`, heartsCollected: heartToAdd });
          }
        });
      });
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  });
});

app.get('/inventory/:passphrase', (req, res) => {
  // Find the user by passphrase and then get the aggregate inventory for that user
  db.get('SELECT id FROM users WHERE passphrase = ?', [req.params.passphrase], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (user) {
      // Using `GROUP BY` and `SUM` to aggregate inventory quantities
      db.all('SELECT item, SUM(quantity) AS total_quantity FROM inventory WHERE userid = ? GROUP BY item', [user.id], (err, inventory) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        if (inventory) {
          res.status(200).json(inventory);
        } else {
          res.status(404).json({ error: 'Inventory not found' });
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

