const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const port = process.env.PORT || 2000;
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express()

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
    next();
});

mongoose.connect(process.env.MONGO_DB_URL, (err) => {
    err ? console.log("Error connecting to database!") : console.log("Successfully connected to the database!");
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth',require('./Routes/auth'))
app.use('/auth',require('./Routes/question'))
app.listen(port, () => {
    console.log(`App started on port: ${port}.`);
});