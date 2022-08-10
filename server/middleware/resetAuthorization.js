const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config()

module.exports = async (req, res, next) => {
    const {token, email} = req.body
    try {
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [email])
        const secret = process.env.jwtResetSecret + user.rows[0].password
        const payload = jwt.verify(token, secret);
        req.user = payload.user
        next();
    } catch (err) {
        console.error(err.message)
        res.status(403).json("Not Authorize");
    }
}