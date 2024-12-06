const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Your routes go here

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
