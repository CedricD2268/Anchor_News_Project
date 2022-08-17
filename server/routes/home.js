const router = require("express").Router();
const authorization = require("../middleware/authorization");
const resetAuthorization = require("../middleware/resetAuthorization");
const pool = require("../db");
const googleAuth = require("../middleware/googleAuth");
const bcrypt = require("bcrypt");
const imageUrlGenerator = require("../middleware/imageUrlGenerator")
const fetch = require('node-fetch');
const axios = require('axios')
const got = require("got");
const multer = require('multer');
const aws = require("aws-sdk");
const update = require("react-addons-update");
const isEqual = require('lodash.isequal');
const _ = require('underscore');
const sightengine = require("sightengine");
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
require('dotenv').config();

const region = process.env.DO_SPACE_REGION
const bucketName = process.env.DO_SPACE_NAME
const accessKeyId = process.env.DO_SPACE_KEY
const secretAccessKey = process.env.DO_SECRET_KEY
const sightengineApiUser = process.env.SIGHTENGINE_API_USER
const sightengineApiSecret = process.env.SIGHTENGINE_API_SECRET
process.env.TZ = "UTC";


pg = require('pg')
types = require('pg').types
pg.types.setTypeParser(1114, str => str);

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})


const upload = multer({
    storage: multer.memoryStorage(),
    // file size limitation in bytes
    limits: {fileSize: 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type'));
        }
    }
});


router.post("/get/promise-image-url", authorization, imageUrlGenerator, upload.single('image'), async (req, res) => {
    try {

        let Imageerror;
        const encoded = req.file.buffer.toString('base64')
        sightengine(sightengineApiUser, sightengineApiSecret)
            .check(['nudity', 'gore'])
            .set_bytes(encoded, 'image.png')
            .then(async (response) => {
                const nudity = response.nudity

                if (nudity && nudity.safe && nudity.safe < 0.13 && !Imageerror) {
                    Imageerror = {error: 'Sorry the image has been flagged for nudity. Please remove and upload another image and try to submit again.'}
                    return res.json(Imageerror)
                }

                await axios.put(
                    req.do_url, // The url which was generated
                    req.file.buffer, { // Using your own json object
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'x-amz-acl': 'public-read'
                        },
                    })

                const update_user_profile = await pool.query("SELECT fullname,username, email, notif, medianame, avatarlocation FROM update_user_profile_avatar_func($1,$2);",
                    [req.user.id, req.do_url.split('?')[0]])
                return res.json(update_user_profile.rows[0])

            })
            .catch(function (e) {
                if (e.response) {
                    console.log(e.response.data);
                } else {
                    console.log(e.message);
                }

            })

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.get("/delete_profile_image", authorization, async (req, res) => {
    try {
        const view_user_url = await pool.query("SELECT avatarlocation FROM view_user_account_profile_func($1);", [req.user.id])
        if (view_user_url && view_user_url.rows[0]&& view_user_url.rows[0].avatarlocation && view_user_url.rows[0].avatarlocation.includes('digitaloceanspaces.com')) {
            const keyname = view_user_url.rows[0].avatarlocation.split('digitaloceanspaces.com/')[1];
            await s3.deleteObject({
                Key: keyname,
                Bucket: bucketName
            }).promise()
        }
        const update_user_profile = await pool.query("SELECT fullname,username, email, notif, medianame, avatarlocation FROM update_user_profile_avatar_func($1,NULL);",
            [req.user.id])
        return res.json(update_user_profile.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.get("/view/profile", authorization, async (req, res) => {
    try {
        const view_user_profile = await pool.query("SELECT fullname, username, email, notif, medianame, avatarlocation FROM view_user_account_profile_func($1);",[req.user.id])
        const view_user_customization = await pool.query("SELECT * FROM view_user_customization_func($1);", [req.user.id])
        const newProfile = update(view_user_profile.rows[0], {$merge: view_user_customization.rows[0]})
        return res.json(newProfile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/update/profile", authorization, async (req, res) => {
    let {username, name, notification} = req.body;

    try {
        const check_user = await pool.query("SELECT fullname, username, notif FROM view_user_account_profile_func($1);", [req.user.id])
        if (name && name.length > 128) {
            return res.status(401).json({error: 'true', errorFull: 'Name is too long, must be between 128 characters.'})
        }
        if (username && username.length > 64) {
            return res.status(401).json({
                error: 'true',
                errorUsername: 'Username is too long, must be between 64 characters.'
            })
        }
        if (username && username.length < 8) {
            return res.status(401).json({
                error: 'true',
                errorUsername: 'Username is too short, must be at least 8 characters.'
            })
        }
        if (username === '' || !username ) {
            username = check_user.rows[0].username
        }

        if (name === '' ||!name) {
            name = check_user.rows[0].fullname
        }

        if (notification === '' || notification === null || notification === undefined) {
            notification = check_user.rows[0].notif
        }

        const all_user_name = await pool.query("SELECT * FROM view_all_username_except_func($1, $2);", [req.user.id, username])
        if (all_user_name.rows.length !== 0) {
            return res.status(401).json({error: 'true', errorUsername: "Username already in use."})
        }
        const update_user_profile = await pool.query("SELECT fullname, username, email, notif, medianame, avatarlocation FROM update_user_profile_func($1,$2,$3,$4);",
            [req.user.id, username, name, notification])
        return res.json(update_user_profile.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/update/account_media", authorization, googleAuth, async (req, res) => {
    try {
        const g_user = req.userInfo;
        const user = await pool.query("SELECT * FROM get_user_account_func($1) WHERE id != $2;", [g_user.email, req.user.id]);
        if (user.rows.length !== 0) {
            return res.status(401).json({error: 'true', errorGoogle: "This email is already in use in another account."})
        }
        const salt = await bcrypt.genSalt(10)
        const bcryptId = await bcrypt.hash(g_user.userId, salt)
        const view_user_profile = await pool.query("SELECT fullname, username, email, notif, medianame, avatarlocation FROM update_user_to_google_account_func($1, $2, $3, $4, $5);",
            [req.user.id, g_user.email, bcryptId, g_user.fullName, g_user.photoUrl])
        return res.json(view_user_profile.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})
//
router.get("/view/customization", authorization, async (req, res) => {
    try {
        const view_user_customization = await pool.query("SELECT defaultUrl,urlOne, urlTwo,urlThree,urlFour,urlFive,cityName,state,country FROM view_user_customization_func($1);",
            [req.user.id])
        return res.json(view_user_customization.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/update/customization", authorization, async (req, res) => {
    const {defaultUrl, urls, city, state} = req.body;
    try {
        const view_user_customization = await pool.query("SELECT * FROM view_user_customization_func($1);", [req.user.id])
        const queryTopic = await pool.query("SELECT article_topic_name FROM article_topic;")

        let allTopicNames=[]

        for(const element of queryTopic.rows){
            allTopicNames.push(Object.values(element)[0])
        }

        const givenTopicNames = (urls && urls.length) ? urls : null;
        const newTopicsCreated = (urls && urls.length) ? urls : null;



        let newDefault;

        if (newTopicsCreated && !newTopicsCreated.includes(view_user_customization.rows[0].defaulttopic)) {
                newDefault = newTopicsCreated[0]
        } else {
            if (allTopicNames.includes(defaultUrl)) {
                newDefault = defaultUrl;
            }
        }

        if (newTopicsCreated && newTopicsCreated.length < 5) {
            for (const element of allTopicNames) {
                if (!newTopicsCreated.includes(element)) {
                    newTopicsCreated.push(element)
                }
            }
        }

        let updated;
        if (givenTopicNames) {
             updated = {
                defaulttopic: newDefault,
                topicone: newTopicsCreated[0],
                topictwo: newTopicsCreated[1],
                topicthree: newTopicsCreated[2],
                topicfour: newTopicsCreated[3],
                topicfive: newTopicsCreated[4],
            }
        }else{
            updated = {
                defaulttopic: newDefault,
                cityname: city ? city : null,
                state: state ? state : null,
            }
        }

        let original = view_user_customization.rows[0]

        //
        for (const element of Object.keys(updated)){
            original = update(original,{$merge: {[element]: updated[element] ? updated[element] : original[element]}})
        }


        if (_.isEqual(original, view_user_customization.rows[0])){
            return res.json(view_user_customization.rows[0])
        }

        const update_user_customization = await pool.query("SELECT defaulttopic, topicone, topictwo, topicthree, topicfour,topicfive, cityname,state FROM update_user_account_customization_func($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            [req.user.id, original.defaulttopic, original.topicone, original.topictwo, original.topicthree, original.topicfour, original.topicfive, original.cityname, original.state])
        return res.json(update_user_customization.rows[0])

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})



router.post("/update/password", authorization, async (req, res) => {
    const {password, email, newPassword} = req.body
    try {
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [email])
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword){
            return res.status(401).json("Invalid password")
        }
        const salt = await bcrypt.genSalt(10)
        const bcryptPassword = await bcrypt.hash(newPassword, salt)
        await pool.query("CALL update_user_password_pcd($1, $2);", [req.user.id, bcryptPassword])
        return res.json({success: true})
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


//
router.get("/delete", authorization, async (req, res) => {
    try {
        const view_user_url = await pool.query("SELECT avatarlocation FROM view_user_account_profile_func($1);", [req.user.id])
        if (view_user_url && view_user_url.rows[0] && view_user_url.rows[0].avatarlocation && view_user_url.rows[0].avatarlocation.includes('digitaloceanspaces.com')) {
            const keyname = view_user_url.rows[0].avatarlocation.split('digitaloceanspaces.com/')[1];
            await s3.deleteObject({
                Key: keyname,
                Bucket: bucketName
            }).promise()
        }
        const articles = await pool.query("Select *  FROM view_article_func($1) ", [req.user.id])
        if (articles.rows) {
            for (const element of articles.rows) {
                const data = [
                    element.body ? element.body : null,
                    element.image ? element.image.split('digitaloceanspaces.com/')[1] : null,
                    element.imagew ? element.imagew.split('digitaloceanspaces.com/')[1] : null,
                    element.imagel ? element.imagel.split('digitaloceanspaces.com/')[1] : null,
                    element.audio ? element.audio.split('digitaloceanspaces.com/')[1] : null
                ]
                for (const key of data) {
                    if (key)
                        await s3.deleteObject({
                            Key: key,
                            Bucket: bucketName
                        }).promise()
                }
            }
        }
        await pool.query("CALL delete_user_pcd($1)", [req.user.id])
        return (res.json(true))

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


// FRONT PAGE BABY======================================================================================================

router.post("/mainfunction/collection", authorization, async (req, res) => {
    const {collectionId, collectionName, name} = req.body
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllCollection'){
            execute_view = {name: "Select *  FROM query_collection_func($1, NULL, NULL, $2) ORDER BY created_on DESC;", object: [req.user.id, 'Execute']}
        }
        if (name === 'InsertCollection'){
            execute_view = {name: "Select *  FROM query_collection_func($1, $2, NULL, $3) ORDER BY created_on DESC;", object: [req.user.id, collectionName ,'Insert']}
        }
        if (name === 'UpdateCollection'){
            execute_view = {name: "Select *  FROM query_collection_func($1, $2, $3, $4) ORDER BY created_on DESC;", object: [req.user.id, collectionName , collectionId, 'Update']}
        }
        if (name === 'DeleteCollection'){
            execute_view = {name: "Select *  FROM query_collection_func($1, NULL, $2, $3) ORDER BY created_on DESC;", object: [req.user.id, collectionId, 'Delete']}
        }
        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/mainfunction/collection_list", authorization, async (req, res) => {
    const {collectionId, name, articlePublishedId, topicName} = req.body
    try {
       let execute_view = {name: "", object: []}

        if (name === 'AllCollectionList'){
            execute_view = {name: "Select *  FROM query_collection_list_func($1, NULL, $2) ORDER BY created_on DESC;", object:[collectionId, 'Execute']}
        }

        if (name === 'AllCollectionListByName'){
            execute_view = {name: "Select *  FROM query_collection_list_func($1, NULL, $2) WHERE topicname = ($3) ORDER BY created_on DESC;", object: [collectionId, 'Execute', topicName ]}
        }

        if (name === 'AllCollectionListByTitle'){
            execute_view = {name: "Select *  FROM query_collection_list_func($1, NULL, $2) ORDER BY title ASC;", object: [collectionId, 'Execute']}
        }

        if (name === 'AllCollectionListByTitleByName'){
             execute_view = {name: "Select *  FROM query_collection_list_func($1, NULL, $2) WHERE topicname = ($3) ORDER BY title ASC;", object: [collectionId, 'Execute', topicName ]}
        }

        if (name === 'InsertCollectionList'){
            execute_view = {name: "Select *  FROM query_collection_list_func($1, $2, $3) ORDER BY created_on DESC;", object: [collectionId, articlePublishedId ,'Insert']}
        }

        if (name === 'DeleteCollectionList'){
            execute_view = {name: "Select *  FROM query_collection_list_func($1, $2, $3) ORDER BY created_on DESC;", object: [collectionId, articlePublishedId, 'Delete']}
        }

        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/mainfunction/article/like", authorization, async (req, res) => {
    const {name, articlePublishedId, topicName} = req.body
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllArticleLikeList'){
            execute_view = {name: "Select * FROM get_article_like_list_func($1) ORDER BY likedate DESC;", object: [req.user.id]}
        }
        if (name === 'AllArticleLikeListByName'){
            execute_view = {name: "Select *  FROM get_article_like_list_func($1) WHERE topicname = $2 ORDER BY likedate DESC;", object: [req.user.id, topicName ]}
        }

        if (name === 'AllArticleLikeListByTitle'){
            execute_view = {name: "Select *  FROM get_article_like_list_func($1) ORDER BY title ASC;", object: [req.user.id]}
        }

        if (name === 'AllArticleLikeListByTitleByName'){
             execute_view = {name: "Select *  FROM get_article_like_list_func($1) WHERE topicname = ($2) ORDER BY title ASC;", object: [req.user.id,topicName ]}
        }

        if (name === 'GetArticleLike'){
            execute_view = {name: "Select *  FROM get_article_like_list_func($1) WHERE publishid = $2 ;", object: [req.user.id, articlePublishedId]}
        }

        if (name === 'InsertArticleLike'){
            execute_view = {name: "CALL query_article_like_list_pcd($1, $2);", object: [req.user.id, articlePublishedId]}
        }

        if (name === 'DeleteAllLike'){
            execute_view = {name: "DELETE FROM article_like WHERE profile_user_id =(select profile_user_id from profile_user where account_user_id = $1)", object: [req.user.id]}
        }

        const result = await pool.query(execute_view.name, execute_view.object)

        if (name === 'GetArticleLike'){
            if (result.rows.length !== 0){
                return res.json(true)
            }
            return res.json(false)
        }
        if (name === 'InsertArticleLike'){
            return res.json('Article like has been toggle')
        }

        if (name === 'DeleteAllLike'){
            return res.json('All liked article deleted')
        }

        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/mainfunction/history", authorization, async (req, res) => {
    const {name, articlePublishedId, topicName} = req.body
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllHistoryList'){
            execute_view = {name: "Select * FROM get_history_list_func($1) ORDER BY historydate DESC;", object: [req.user.id]}
        }
        if (name === 'AllHistoryListByName'){
            execute_view = {name: "Select *  FROM get_history_list_func($1) WHERE topicname = $2 ORDER BY historydate DESC;", object: [req.user.id, topicName ]}
        }

        if (name === 'AllHistoryListByTitle'){
            execute_view = {name: "Select *  FROM get_history_list_func($1) ORDER BY title ASC;", object: [req.user.id]}
        }

        if (name === 'AllHistoryListByTitleByName'){
             execute_view = {name: "Select *  FROM get_history_list_func($1) WHERE topicname = ($2) ORDER BY title ASC;", object: [req.user.id,topicName]}
        }

        if (name === 'InsertHistory'){
            execute_view = {name: "CALL query_history_list_pcd($1, $2, $3);", object: [req.user.id, articlePublishedId, 'Insert']}
            await pool.query("CALL query_history_admin_list_pcd($1, $2, $3);", [req.user.id, articlePublishedId, 'Insert'])
        }

        if (name === 'DeleteHistory'){
            execute_view = {name: "CALL query_history_list_pcd($1, $2, $3);", object: [req.user.id, articlePublishedId, 'Delete']}
        }

        if (name === 'DeleteAllHistory'){
            execute_view = {name: "DELETE FROM history_list WHERE profile_user_id =(select profile_user_id from profile_user where account_user_id = $1) ", object: [req.user.id]}
        }

        const result = await pool.query(execute_view.name, execute_view.object)

        if (name === 'InsertHistory' || name === 'DeleteHistory') {
            return res.json('Article history has been toggle')
        }
        if (name === 'DeleteAllHistory') {
            return res.json('All history article are deleted')
        }

        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/mainfunction/following", authorization, async (req, res) => {
    const {name, username, topicName} = req.body
    try {
        let execute_view = {name: "", object: []}

        if (name === 'AllFollowingList') {
            execute_view = {
                name: "Select * FROM get_following_list_func($1) WHERE profile_user_id IS NOT NULL ORDER BY created_on DESC;",
                object: [req.user.id]
            }
        }
        if (name === 'AllUnFollowingList') {
            execute_view = {
                name: "Select * FROM get_unfollowing_list_func($1) ORDER BY created_on DESC;",
                object: [req.user.id]
            }
        }

        if (name === 'GetFollowSelfCount') {
            execute_view = {
                name: "Select count(*)  FROM get_following_list_view WHERE  profile_following_id = (select profile_user_id from profile_user where account_user_id = $1 );",
                object: [req.user.id]
            }

        }

        if (name === 'GetFollowOtherCount') {
            execute_view = {
                name: "Select count(*)  FROM get_following_list_view WHERE profile_following_id = (select profile_user_id from profile_user where user_name = $1 );",
                object: [username]
            }

        }

        if (name === 'GetFollowArticlesByTitle') {
            execute_view = {
                name: "Select *  FROM get_article_view WHERE username = $1 AND publisheddate IS NOT NULL ORDER BY title ASC;",
                object: [username]
            }
        }
        if (name === 'GetFollowArticlesByDate') {
            execute_view = {
                name: "Select *  FROM get_article_view  WHERE username = $1 AND publisheddate IS NOT NULL ORDER BY modifieddate DESC ;",
                object: [username]
            }
        }

        if (name === 'GetFollowArticlesByName') {
            execute_view = {
                name: "Select *  FROM get_article_view WHERE username = $1 AND topicname = $2 AND publisheddate IS NOT NULL ORDER BY modifieddate DESC;",
                object: [username, topicName]
            }
        }

        if (name === 'GetFollowArticlesTitleByName') {
            execute_view = {
                name: "Select *  FROM get_article_view WHERE username = $1 AND topicname = $2 AND publisheddate IS NOT NULL ORDER BY title ASC ;",
                object: [username, topicName]
            }
        }

        if (name === 'GetFollowAvatar') {
            execute_view = {
                name: "Select avatarlocation FROM get_user_profile_view WHERE username = $1;",
                object: [username]
            }
        }

        if (name === 'GetFollowing'){
            execute_view = {
                name: "Select *  FROM get_following_list_view WHERE profile_user_id = (select profile_user_id from profile_user where account_user_id = $1 ) AND profile_following_id = (select profile_user_id from profile_user where user_name = $2 );",
                object: [req.user.id, username]}
        }

        if (name === 'InsertFollowing') {
            execute_view = {
                name: "CALL query_following_list_pcd($1, $2);",
                object: [req.user.id, username]
            }
        }

        const result = await pool.query(execute_view.name, execute_view.object)

        if (name === 'InsertFollowing'){
            return res.json('A user has been followed or unfollow')
        }
        if (name === 'GetFollowing') {
            if (result.rows.length !== 0) {
                return res.json(true)
            }
            return res.json(false)
        }

        if (name === 'GetFollowAvatar') {
            return res.json(result.rows[0])
        }
        if (name === 'GetFollowSelfCount' || name === 'GetFollowOtherCount' ) {
            return res.json(result.rows[0].count)
        }


        return res.json(result.rows)

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/mainfunction/search", authorization, async (req, res) => {
    let {name, topicName, search} = req.body
    if (search){
        search =`%${search}%`
    }
    try {
        let execute_view = {name: "", object: []}

        if (name === 'publishedByTitle') {
            execute_view = {name: "Select *  FROM get_article_view WHERE LOWER(title) LIKE LOWER($1) AND publisheddate IS NOT NULL ORDER BY title ASC;", object: [search]}
        }
        if (name === 'publishedByDate') {
            execute_view = {name: "Select *  FROM get_article_view  WHERE LOWER(title) LIKE LOWER($1) AND publisheddate IS NOT NULL ORDER BY modifieddate DESC ;", object: [search]}
        }

        if (name === 'publishedTopicByDate') {
            execute_view = {name: "Select *  FROM get_article_view WHERE LOWER(title) LIKE LOWER($1) AND topicname = $2 AND publisheddate IS NOT NULL ORDER BY modifieddate DESC;", object: [search, topicName]}
        }

        if (name === 'publishedTopicByTitle') {
            execute_view = {name: "Select *  FROM get_article_view WHERE LOWER(title) LIKE LOWER($1) AND topicname = $2 AND publisheddate IS NOT NULL ORDER BY title ASC ;", object: [search, topicName]}
        }
        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/view/row_article", authorization, async (req, res) => {
    let { topic} = req.body
    try {
        const result = await pool.query("SELECT * FROM view_article_row_by_name_all_func($1,$2);", ['douillard1234@gmail.com', topic])
        return res.json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})








module.exports = router;
