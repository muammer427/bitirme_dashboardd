const express = require('express');
const pool = require('./db');
const axios = require('axios'); // Import axios
const fs = require('fs'); // Import fs for file operations
const router = express.Router();
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
// Create product table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    img TEXT,
    barcode VARCHAR(150),
    title VARCHAR(150),
    description VARCHAR(250),
    productcode INTEGER,
    brand INTEGER,
    stock VARCHAR(250),
    desi VARCHAR(250),
    currency VARCHAR(250),
    listprice VARCHAR(250),
    saleprice VARCHAR(250),
    cargo VARCHAR(250),
    vatrate VARCHAR(250),
    categoriAttributes VARCHAR(250),
    category VARCHAR(250)
  );
`;

pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table:', err.stack);
  } else {
    console.log('Table "product" is ready');
  }
});

// Insert data into table
router.post('/add-product', async (req, res) => {
  const data = req.body;
  console.log('Received data to insert:', data);

  const fields = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO product (${fields}) VALUES (${placeholders}) RETURNING *`;

  try {
    const result = await pool.query(query, values);
    console.log('Data inserted:', result.rows[0]);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).send(err.message);
  }
  exec('python3 1.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});exec('python3 2.py', (error, stdout, stderr) => {
  if (error) {
      console.error(`Error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
  }
  console.log(`Output: ${stdout}`);
});
  
});

// Fetch all products
router.get('/products', async (req, res) => {
  console.log('Received request to fetch all products');
  const query = 'SELECT * FROM product';

  try {
    const result = await pool.query(query);
    console.log('Fetched products:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send(err.message);
  }
  
});

// Fetch product count
router.get('/products/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM product');
    const count = result.rows[0].count;
    res.json({ count });
  } catch (err) {
    console.error('Error fetching products count:', err.message);
    res.status(500).send(err.message);
  }
  
});

// Delete a product by ID
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete product with ID ${id}`);

  const query = 'DELETE FROM product WHERE id = $1 RETURNING *';

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Product not found');
    }
    console.log('Product deleted:', result.rows[0]);

    // Save the ID to a file
    fs.writeFile('deleted_product_id.txt', id, (err) => {
      if (err) {
        console.error('Error writing ID to file:', err.message);
      } else {
        console.log('ID written to file');
        
        // Python scripti çalıştır
        exec('python3 deneme.py', (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.error(`Stderr: ${stderr}`);
              return;
          }
          console.log(`Output: ${stdout}`);
      });
        
      }
    });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).send(err.message);
  }
});





// Update a product by ID
router.put('/update-product/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log('Received data to update:', data);

  const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(data);

  const query = `UPDATE product SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;

  try {
    const result = await pool.query(query, [...values, id]);
    console.log('Data updated:', result.rows[0]);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error('Error updating data:', err.message);
    res.status(500).send(err.message);
  }
  exec('python3 1.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});
exec('python3 3.py', (error, stdout, stderr) => {
  if (error) {
      console.error(`Error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
  }
  console.log(`Output: ${stdout}`);
});
exec('python3 4.py', (error, stdout, stderr) => {
  if (error) {
      console.error(`Error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
  }
  console.log(`Output: ${stdout}`);
});
exec('python3 5.py', (error, stdout, stderr) => {
  if (error) {
      console.error(`Error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
  }
  console.log(`Output: ${stdout}`);
});
});

router.get('/products/:id/barcode', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to fetch barcode for product with ID ${id}`);

  const query = 'SELECT barcode FROM product WHERE id = $1';

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Product not found');
    }
    const barcode = result.rows[0].barcode;
    console.log('Fetched barcode:', barcode);
    res.status(200).json({ barcode });
  } catch (err) {
    console.error('Error fetching barcode:', err.message);
    res.status(500).send(err.message);
  }
  
});

module.exports = router;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
