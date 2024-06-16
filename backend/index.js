const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./productRoute');
const magazaRoutes = require('./magazaRoute');


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', productRoutes);
app.use('/', magazaRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
