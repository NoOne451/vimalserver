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

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).send("Error fetching orders");
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.send("Order deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting order");
  }
});

// Handle form submission
app.post('/submit', async (req, res) => {
  if (!req?.body?.name) res.status(400).send('Name is required');
  if (!req?.body?.year) res.status(400).send('Year is required');
  if (!req?.body?.branch) res.status(400).send('Branch is required');
  if (!req?.body?.item) res.status(400).send('Item is required');
  if (!req?.body?.phone) res.status(400).send('Phone is required');
  if (!req?.body?.quantity) res.status(400).send('Quantity is required');

  const { name, year, branch, item, phone, quantity } = req.body;
  console.log(name, year, branch, item, phone, quantity);
  const newOrder = new Order({
    name,
    year,
    branch,
    item,
    phone,
    quantity,
  });

  // const order = await newOrder
  //   .save()
  //   .then(() => {
  //     // Send success response to the frontend
  //     res.status(200).send('Order submitted successfully');
  //   })
  //   .catch((err) => {
  //     console.error('Error submitting order:', err);
  //     // Send error response to the frontend
  //     res.status(500).send('Error submitting order');
  //   });
  try {
    const order = await newOrder.save();
    console.log(order);
    res.status(200).send('Order submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting order');
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
