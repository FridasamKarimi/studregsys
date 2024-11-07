const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Set up Express
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Leave it blank for default XAMPP MySQL password
  database: 'studregsys', // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Route to handle student registration
app.post('/register', (req, res) => {
  const { full_name, date_of_birth, passport_id } = req.body;

  // Insert student into the database
  const query = 'INSERT INTO students (full_name, date_of_birth, passport_id) VALUES (?, ?, ?)';
  connection.query(query, [full_name, date_of_birth, passport_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Database error', details: err });
    } else {
      res.status(200).json({ message: 'Student registered successfully', studentId: result.insertId });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
