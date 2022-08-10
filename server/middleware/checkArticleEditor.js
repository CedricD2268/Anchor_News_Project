const pool = require("../db");
require("dotenv").config()

module.exports = async (req, res, next) => {
    try {
        const checkPublished = await pool.query('SELECT * from view_article_func($1) WHERE articleid = $2 AND publisheddate IS NOT NULL;', [req.user.id,req.body.articleId])
        if (checkPublished && checkPublished.rows && checkPublished.rows.length !== 0) {
            return res.status(403).json("Not Authorize");
        }
        next();
    } catch (err) {
        console.error(err.message)
        res.status(403).json("Not Authorize");
    }
}