const fs = require("fs");
const path = require("path");
const Pool = require("pg").Pool
require('dotenv').config();
const pool = new Pool({
    user: process.env.DO_CLUSTER_USER,
    password: process.env.DO_CLUSTER_PASSWORD,
    host:process.env.DO_CLUSTER_HOST,
    port: process.env.DO_CLUSTER_PORT,
    database: process.env.DO_CLUSTER_DATABASE,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(path.join(__dirname, 'ca-certificate.crt'))
    }


})
module.exports = pool