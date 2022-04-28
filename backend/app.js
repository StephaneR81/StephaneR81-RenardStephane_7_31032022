//Imports
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');

const db = require('./models');

const authRoutes = require('./routes/authRoutes');
const picturesRoutes = require('./routes/picturesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

//Define http headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // From all origins
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Parses JSON content in requests
app.use(express.json());

//Sanitizes request header keys and set some http headers
app.use(helmet());

//Filters user inputs to prevent XSS attacks
app.use(xss());

//Defines a static folder for serving images
app.use('/images', express.static(path.join(__dirname, 'images')));


db.sequelize.sync({
    // force: true
}).then(() => {
    console.log("Drop and re-sync db.");
});

app.use('/api/auth/', authRoutes);
app.use('/api/pictures/', picturesRoutes);
app.use('/api/comments/', commentsRoutes);

module.exports = app;