const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Use the cors middleware to allow cross-origin requests
app.use(cors());

// Connect to SQLite database (or create a new one if it doesn't exist)
const db = new sqlite3.Database('mydatabase.db');

// Create a table for your data if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS jsonData (message TEXT, timestamp TEXT)');
});

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Define a route that serves JSON data from the database
app.get('/api/data', (req, res) => {
  // Query the database to get JSON data
  db.all('SELECT * FROM jsonData', (err, rows) => {
    if (err) {
      console.error('Error fetching JSON data', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Send the JSON response
      res.json(rows);
    }
  });
});

// Define a route to add data to the database
app.post('/api/data', (req, res) => {
    const { message, timestamp } = req.body;
  
    // Insert the data into the database
    db.run('INSERT INTO jsonData (message, timestamp) VALUES (?, ?)', [message, timestamp], (err) => {
      if (err) {
        console.error('Error adding data to the database', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(201).json({ message: 'Data added successfully' });
      }
    });
  });

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});