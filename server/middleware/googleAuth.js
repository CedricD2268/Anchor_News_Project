const {OAuth2Client} = require('google-auth-library');
// const jwt = require("jsonwebtoken");
require("dotenv").config()
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

module.exports = async (req, res, next) => {
    const {token} = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(`User ${payload.name} verified`);

        const {sub, email, name, picture} = payload;
        const userId = sub;
        req.userInfo = {userId, email, fullName: name, photoUrl: picture}
        next()

    } catch (err) {
        console.error(err.message)
        res.status(403).json("Not Authorize");
    }
}