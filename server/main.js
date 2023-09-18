const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const crypto = require ('crypto'); // Add this to generate a random string 
const cors = require('cors');
const app = express();
const port = 3000;

// Use the cors middleware to allow cross-origin requests
app.use(cors());

// Add after other middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data

// Connect to SQLite database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('mydatabase.db');

// Create a table for your data if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (name TEXT, passphrase TEXT)');
});

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { name } = req.body;
  const passphrase = crypto.randomBytes(16).toString('hex');

  // Insert the user data into users table
  db.run('INSERT INTO users (name, passphrase) VALUES (?, ?)', [name, passphrase], (err) => {
    if (err) {
      console.error('Error registering user', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ passphrase: passphrase }); // Return the passphrase as response
    }
  });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});