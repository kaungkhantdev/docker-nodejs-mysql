import express from 'express';
import mysql from 'mysql';
import util from 'util';

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'host.docker.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ecommerce'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Promisify the query method
const query = util.promisify(db.query).bind(db);

app.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users');
    res.json(result);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});