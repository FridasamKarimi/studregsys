const db = require('./db.js'); // Assuming your file is named db.js

db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('The solution is:', results[0].solution); // Should output "2"
});
