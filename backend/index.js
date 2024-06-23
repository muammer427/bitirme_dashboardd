const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./productRoute');
const magazaRoutes = require('./magazaRoute');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/products', productRoutes);
app.use('/magazalar', magazaRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
