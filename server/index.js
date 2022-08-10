const express = require("express");
const  app = express();
const cors = require("cors");
const bodyParser = require("express");
const  cookieParser = require('cookie-parser')
app.use(cookieParser());
const path = require("path");
const pg = require("pg");

pg.types.setTypeParser(1114, str => moment.utc(str).format());

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());

// Routes//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Register and Login Routes
app.use('/images', express.static('images'));
app.use('/auth', require('./routes/jwtAuth'))
app.use('/home', require('./routes/home'))
app.use('/homeExtend', require('./routes/homeExtend'))
app.use('/studio', require('./routes/studio'))

app.listen(5000, () =>{
    console.log("server is running on port 5000!");
})