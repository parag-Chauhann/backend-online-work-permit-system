// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const payuRoutes = require('./routes/payuRoutes');
const userRoutes = require('./routes/userRoutes'); // Import the new routes

app.use('/subscription/api/payu', payuRoutes);
app.use('/success/api', userRoutes); // Corrected route prefix

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
