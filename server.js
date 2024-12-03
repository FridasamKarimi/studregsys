const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
let users = [];

//handle user registration
app.post('/register', async (req, res) => {
  const { fullname, dob, passportId, password, course } = req.body;
  

  //validate input
  if (!fullname || !dob || !passportId || !password || !course ) { 
    return res.status(400).json({ success: false, error: 'All fields are required,'});
  }

  //Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  //store user data
  const newUser = { fullname, dob, passportId, course, passsword: hashedPassword };
  users.push(newUser);

  return res.status(200).json({ success: true, message: 'Registration Successfull!' });
});

//handle user login
app.post('/login', async (req, res) => {
  const { passportId, password } = req.body;

  //validate password
  if (!passportId ||!password) {
    return res.status(400).json({ success: false, error: 'Passport ID and Password are required,'});
  }

  //compare the hashed passord
  const isPasswordValid = await bcrypt.compare(password, user.paassword);
  if (!isPasswordValid) {
    return res.status(200).json({ success: true, message: 'Login Successful' });
    } else {
      return res.status(400).json({ succss: false,error: 'Invalid lOgin' });
    }
  
});

//Start server
app.listen(port, () => {
  console.log('Server running at http://localhost:${port}');  
  
})

