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

// Helper function to calculate age based on the date of birth
const calculateAge = (dob) => {
  const currentDate = new Date();
  const birthDate = new Date(dob);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Registration Route
app.post('/register', async (req, res) => {
  const { fullname, dob, passportId, password, course } = req.body;

  // Validate input
  if (!fullname || !dob || !passportId || !password || !course) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  // Age validation (must be at least 16 years old)
  const age = calculateAge(dob);
  if (age < 16) {
    return res.status(400).json({ success: false, error: 'You must be at least 16 years old to register.' });
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

// Login Route
app.post('/login', (req, res) => {
  const { fullname, password } = req.body;

  if (!fullname || !password) {
    return res.status(400).json({ success: false, error: 'Passport ID and password are required.' });
  }

  // Find user by passportId
  const query = 'SELECT * FROM students WHERE fullname = ?';
  db.query(query, [fullname], async (err, result) => {
    if (err) {
      console.error('Error querying the database: ', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid Passport ID or password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Passport ID or password.' });
    }

    // Success response
    res.status(200).json({ success: true, message: 'Login successful!' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
