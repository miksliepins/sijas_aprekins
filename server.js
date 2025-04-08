const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👇 Connect to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'license_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

app.post('/api/check-license', (req, res) => {
  const { licenseKey } = req.body;
  const query = 'SELECT * FROM licenses WHERE license_key = ? AND is_active = 1';

  db.query(query, [licenseKey], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });

    if (results.length > 0) {
      res.json({ success: true, user: results[0].issued_to });
    } else {
      res.status(404).json({ success: false, error: 'License key not found' });
    }
  });
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
