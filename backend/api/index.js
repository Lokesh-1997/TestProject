const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('../db'); // Ensure this file exists and properly connects to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("server is running..");
});

// Connect to DB
connectDB();

// Define your routes here
app.use('/assessments', require('./assessments'));
app.use('/results', require('./results'));

app.listen(5000, () => {
    console.log("App is running on port 5000");
});

module.exports = app;
