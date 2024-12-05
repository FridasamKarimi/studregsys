const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./db'); // Import the MySQL connection
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/register', async (req, res) => {
  const { fullname, dob, passportId, password, course } = req.body;

  // Validate input
  if (!fullname || !dob || !passportId || !password || !course) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data to the database
    const query = 'INSERT INTO students (fullname, dob, passportid, course, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [fullname, dob, passportId, course, hashedPassword], (err) => {
      if (err) {
        console.error('Error inserting student data: ', err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      // Success response
      res.status(201).json({ success: true, message: 'Registration successful!' });
    });
  } catch (err) {
    console.error('Error during registration: ', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
