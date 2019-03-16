const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const port = process.env.PORT || 2000;
const app = express()

// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "localhost");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

const allowCrossDomain = function(req, res, next) {

    var allowedOrigins = ['http://localhost:3000','http://ithenigma.ieeevit.com'];

    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Connection','keep-alive');
    res.header('Keep-Alive','timeout=200');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, captchaCookie");
    res.header('content-type', 'application/json');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        var headers = {
            "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
            "Access-Control-Allow-Credentials" : true
        };
        res.writeHead(200, headers);
        res.end();
    } else {
        next();
    }
}

mongoose.connect(process.env.MONGO_DB_URL, (err) => {
    err ? console.log("Error connecting to database!") : console.log("Successfully connected to the database!");
});


app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth',require('./Routes/auth'))
app.use('/question',require('./Routes/question'))
app.listen(port, () => {
    console.log(`App started on port: ${port}.`);
});