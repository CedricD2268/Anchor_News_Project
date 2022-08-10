const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtGenerator = (account_user_id) =>{
    const payload = {
        user: account_user_id
    }
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "2hr"})
}

module.exports = jwtGenerator;

