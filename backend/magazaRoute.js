const express = require('express');
const pool = require('./db'); // Adjust path as necessary

const router = express.Router();

// Define columns for the "magazalar" table
const columns = [
  { field: "id", type: "SERIAL PRIMARY KEY" },
  { field: "MagazaIsim", type: "VARCHAR(250)" },
  { field: "ApiKey", type: "VARCHAR(250)" },
  { field: "ApiSecret", type: "VARCHAR(250)" },
  { field: "SaticiId", type: "VARCHAR(250)" },
];

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS magazalar (
    ${columns.map(col => `${col.field} ${col.type}`).join(', ')}
  );
`;

pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table:', err.stack);
  } else {
    console.log('Table "magazalar" is ready');
  }
});

router.post('/add-magaza', async (req, res) => {
  const data = req.body;
  console.log('Received data to insert:', data);

  const fields = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO magazalar (${fields}) VALUES (${placeholders}) RETURNING *`;

  try {
    const result = await pool.query(query, values);
    console.log('Data inserted:', result.rows[0]);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).send(err.message);
  }
});

router.get('/magazalar', async (req, res) => {
  const query = 'SELECT * FROM magazalar';

  try {
    const result = await pool.query(query);
    console.log('Fetched magazalar:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching magazalar:', err.message);
    res.status(500).send(err.message);
  }
});

router.get('/magazalar/count', async (req, res) => { 
  try {
    const result = await pool.query('SELECT COUNT(*) FROM magazalar');
    const count = result.rows[0].count;
    res.json({ count });
  } catch (err) {
    console.error('Error fetching magazalar count:', err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
