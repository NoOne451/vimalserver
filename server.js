// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => console.log("Connected to MongoDB"));

// Define a schema for the data
const orderSchema = new mongoose.Schema({
  name: String,
  year: String,
  branch: String,
  item: String,
  phone: String,
  quantity: Number,
});

const Order = mongoose.model("Order", orderSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.get("/", (req, res) => {
  // Send the index.html file from the frontend directory
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Handle form submission
app.post("/submit", (req, res) => {
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
      res.status(200).send("Order submitted successfully");
    })
    .catch((err) => {
      console.error("Error submitting order:", err);
      // Send error response to the frontend
      res.status(500).send("Error submitting order");
    });
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
