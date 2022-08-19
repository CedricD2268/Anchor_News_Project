const express = require("express");
const  app = express();
const cors = require("cors");
const bodyParser = require("express");
const  cookieParser = require('cookie-parser')
app.use(cookieParser());
const path = require("path");
const pg = require("pg");

pg.types.setTypeParser(1114, str => moment.utc(str).format());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000", "https://njanchor.com"],
  credentials: true,
  optionsSuccessStatus: 200
}));


const allowedDomains = ["http://localhost:3000", "http://localhost:5000", "https://njanchor.com", "https://localhost:5000", "https://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);

    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));



// app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes//


//Register and Login Routes
app.use('/images', express.static('images'));
app.use('/auth', require('./routes/jwtAuth'))
app.use('/home', require('./routes/home'))
app.use('/homeExtend', require('./routes/homeExtend'))
app.use('/service', require('./routes/service'))
app.use('/studio', require('./routes/studio'))


app.use(express.static(path.join(__dirname, '../client/build')));
// Handle React routing, return all requests to React app
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


app.listen(5000, () =>{
    console.log("server is running on port 5000!");
})

