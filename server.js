// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
  })
);
// MongoDB setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema for the data
const orderSchema = new mongoose.Schema({
  name: String,
  year: String,
  branch: String,
  item: String,
  phone: String,
  quantity: Number,
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/', (req, res) => {
  // Send the index.html file from the frontend directory
  // res.sendFile(path.join(__dirname, "../frontend", "index.html"));
  res.json('Server is Working');
});

// Handle form submission
app.post('/submit', (req, res) => {
  console.log(res.body);
  if (!req?.body?.name) res.send('Name is required').status(400);
  if (!req?.body?.year) res.send('Year is required').status(400);
  if (!req?.body?.branch) res.send('Branch is required').status(400);
  if (!req?.body?.item) res.send('Item is required').status(400);
  if (!req?.body?.phone) res.send('Phone is required').status(400);
  if (!req?.body?.quantity) res.send('Quantity is required').status(400);

  const { name, year, branch, item, phone, quantity } = req.body;

  const newOrder = new Order({
    name,
    year,
    branch,
    item,
    phone,
    quantity,
  });

  newOrder
    .save()
    .then(() => {
      // Send success response to the frontend
      res.status(200).send('Order submitted successfully');
    })
    .catch((err) => {
      console.error('Error submitting order:', err);
      // Send error response to the frontend
      res.status(500).send('Error submitting order');
    });
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
