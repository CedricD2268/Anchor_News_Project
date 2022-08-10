const Pool = require("pg").Pool
const pool = new Pool({
    user:"cedricd22",
    password: "z\"yW5w}<UyrW7k4udfr2",
    host:"localhost",
    port: 5432,
    database: "React_NJT"
})

module.exports = pool