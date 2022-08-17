const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const crypto = require('crypto')
require('dotenv').config();
const { promisify } = require('util')
const randomBytes = promisify(crypto.randomBytes)
process.env.TZ = "UTC";


router.post("/mainfunction/comments", authorization, async (req, res) => {
    const {name, publishId, commentId, commentBody} = req.body
    const rawBytes = await randomBytes(16)
    const Id = rawBytes.toString('hex')
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllComments') {
            execute_view = {
                name: "Select *  FROM get_comment_list_view WHERE article_published_id = $1 ORDER BY created_on DESC;",
                object: [publishId]
            }
        }

        if (name === 'Newest comments') {
            execute_view = {
                name: "Select *  FROM get_comment_list_view WHERE article_published_id = $1 ORDER BY created_on DESC;",
                object: [publishId]
            }
        }

        if (name === 'Oldest comments') {
            execute_view = {
                name: "Select *  FROM get_comment_list_view WHERE article_published_id = $1 ORDER BY created_on ASC;",
                object: [publishId]
            }
        }

        if (name === 'Most liked') {
            execute_view = {
                name: "Select *  FROM get_comment_list_view_count WHERE article_published_id = $1 ORDER BY count DESC;",
                object: [publishId]
            }
        }

        if (name === 'InsertComment') {
            execute_view = {
                name: "Select *  FROM query_comment_list_func($1, $2, $3, $4, $5) ORDER BY created_on DESC;",
                object: [req.user.id, publishId, Id, commentBody, 'Insert']
            }
        }

        if (name === 'AllCommentsCount') {
            const commentCount = await pool.query("Select count(*)  FROM get_comment_list_view WHERE article_published_id = $1;", [publishId])
            const replyCount = await pool.query("Select count(*)  FROM view_all_comment_count WHERE article_published_id = $1;", [publishId])
            return res.json(parseInt(commentCount.rows[0].count) + parseInt(replyCount.rows[0].count))

        }


        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})



router.post("/mainfunction/comment/likes", authorization, async (req, res) => {
    const {name, commentId} = req.body
    try {
        let execute_view = {name: "", object: []}

        if (name === 'GetCommentLike') {
            execute_view = {
                name: "Select * FROM get_comment_like_list_func($1, $2);",
                object: [req.user.id, commentId]}
        }
        if (name === 'ViewCommentLikeCount') {
            execute_view = {
                name: "Select count(*) FROM get_comment_like_list_view WHERE comment_id = $1;",
                object: [commentId]
            }
        }
        if (name === 'InsertCommentLike') {
            execute_view = {
                name: "CALL query_comment_like_list_pcd($1, $2, $3);",
                object: [req.user.id, commentId, 'Insert']
            }
        }

        const result = await pool.query(execute_view.name, execute_view.object)

        if (name !== 'InsertCommentLike') {
            return res.json(result.rows && result.rows[0] ? result.rows[0] : null)
        }
        return res.json(false)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/mainfunction/reply_comments", authorization, async (req, res) => {
    const {name,  commentId, commentBody} = req.body
    const rawBytes = await randomBytes(16)
    const Id = rawBytes.toString('hex')
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllReplyComments'){
            execute_view = {
                name: "Select * FROM get_comment_reply_list_view WHERE comment_id = $1 ORDER BY created_on ASC;",
                object: [commentId]
            }
        }

        if (name === 'InsertReplyComment'){

            execute_view = {
                name: "Select * FROM query_comment_reply_list_func($1, $2, $3, $4, $5) ORDER BY created_on DESC;",
                object: [req.user.id,  Id ,commentId ,commentBody, 'Insert']
            }
        }

        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/mainfunction/reply_comment/likes", authorization, async (req, res) => {
    const {name,  commentReplyId} = req.body

    try {
        let execute_view = {name: "", object: []}

        if (name === 'GetReplyCommentLike'){
            execute_view = {
                name: "Select * FROM get_comment_reply_like_list_func($1, $2);",
                object: [req.user.id, commentReplyId]
            }
        }
        if (name === 'ViewReplyCommentLikeCount'){
            execute_view = {
                name: "Select count(*) FROM get_comment_reply_like_list_view WHERE comment_reply_id = $1;",
                object: [commentReplyId]
            }
        }
        if (name === 'InsertReplyCommentLike'){
            execute_view = {
                name: "CALL query_comment_reply_like_list_pcd($1, $2, $3);",
                object: [req.user.id, commentReplyId , 'Insert']
            }
        }

        const result = await pool.query(execute_view.name, execute_view.object)
        if(name !== 'InsertReplyCommentLike'){
            return res.json(result.rows && result.rows[0] ?  result.rows[0]: null)
        }
        return res.json('Insert reply comment like Success!')

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/mainfunction/get_read", authorization, async (req, res) => {
    const {publishId} = req.body
    try {
        await pool.query('CALL query_read_article_admin_list_pcd($1, $2)', [req.user.id, publishId])
        await pool.query('CALL query_history_admin_list_pcd($1, $2, $3)', [req.user.id, publishId, 'Delete'])
        console.log('You read an article congrats!!')
        return res.json('You read an article congrats!!')
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})



module.exports = router;