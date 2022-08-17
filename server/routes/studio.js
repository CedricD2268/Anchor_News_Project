const router = require("express").Router();
const authorization = require("../middleware/authorization");
const checkArticlePublished = require("../middleware/checkArticleEditor")
const pool = require("../db");
const imageUrlGenerator = require("../middleware/imageUrlGenerator")
const axios = require('axios')
const multer = require('multer');
const aws = require("aws-sdk");
const crypto = require('crypto')
const {promisify} = require('util')
const randomBytes = promisify(crypto.randomBytes)
const update = require('react-addons-update');
const region = process.env.DO_SPACE_REGION
const bucketName = process.env.DO_SPACE_NAME
const accessKeyId = process.env.DO_SPACE_KEY
const secretAccessKey = process.env.DO_SECRET_KEY
const sightengineApiUser = process.env.SIGHTENGINE_API_USER
const sightengineApiSecret = process.env.SIGHTENGINE_API_SECRET
require('dotenv').config();



// process.env.TZ = "UTC";
const pg = require('pg');
const types = pg.types;


const sightengine = require('sightengine');
const textToSpeech = require('@google-cloud/text-to-speech');


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
     limits: {fileSize: 1800 * 1800},
     fileFilter: (req, file, cb) => {
         if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
             cb(null, true);
         } else {
             return cb(new Error('Invalid mime type'));
         }
     }
 });

 router.get("/check/admin", authorization, async (req, res) => {
     try {
         let check_admin = await pool.query("Select * FROM get_user_account_view where id = $1;", [req.user.id])
         if (check_admin && check_admin.rows[0]) {
             check_admin = check_admin.rows[0].group_name
             if (check_admin === 'admin') {
                 return res.json(true)
             } else {
                 return res.json(false)
             }
         }
         return res.json(false)

     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })


 router.post("/create/article", authorization, async (req, res) => {
     const {type, topic} = req.body
     const rawBytes = await randomBytes(16)
     const Id = rawBytes.toString('hex')
     const rawBytesAID = await randomBytes(16)
     const Id_AID = rawBytesAID.toString('hex')
     const params = ({
         Bucket: bucketName,
         Key: Id,
         Body: JSON.stringify('Welcome to studio editor'),
         ContentType: 'text',
         ACL: 'public-read',
     })
     try {
         let count_articles = await pool.query("Select count(*)  FROM view_article_func($1);", [req.user.id])
         count_articles = count_articles.rows[0].count
         if (count_articles > 7) {
             return res.json({errorLimit: true})
         }
         await s3.putObject(params).promise()
         const article = await pool.query("SELECT * FROM create_article_func($1,$2,$3, $4, $5);", [req.user.id, type, Id, Id_AID, topic])
         return res.json(article.rows[0])
     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })

 router.post("/view/article", authorization, async (req, res) => {
     const {articleId, publishId, name} = req.body
     try {
         if (name === 'viewArticleById') {
             let get_article = await pool.query("SELECT * FROM view_article_id_func($1,$2);", [req.user.id, articleId])
             let bodyS3 = await s3.getObject({Bucket: bucketName, Key: get_article.rows[0].body}).promise()
             bodyS3 = bodyS3.Body.toString('utf-8')
             get_article = get_article.rows[0]
             get_article = update(get_article, {$merge: {body: bodyS3}})
             return res.json(get_article)
         }
         if (name === 'viewArticleByUser') {
             const get_article = await pool.query("SELECT * FROM view_article_func($1);", [req.user.id])
             return res.json(get_article.rows[0])
         }

         if (name === 'viewArticleByPublishId') {
             let get_article = await pool.query("SELECT * FROM view_all_article_func() WHERE publishid = $1;", [publishId])
             if (get_article.rows.length === 0) {
                 // console.log('Currently have no articles to show')
                return res.json(false)
            }
             let bodyS3 = await s3.getObject({Bucket: bucketName, Key: get_article.rows[0].body}).promise()
             bodyS3 = bodyS3.Body.toString('utf-8')
             get_article = update(get_article.rows[0], {$merge: {body: bodyS3}})
             return res.json(get_article === undefined ? '' : get_article)
         }
         return res.json('Wrong Command')
     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })

 router.post("/update/article_text", authorization, checkArticlePublished, async (req, res) => {
     const {name ,text, articleId} = req.body;
     let context = null
     let execute_update = {name: "", object: []}
     try {
         if (name === 'title') {
             context = text
             execute_update = {
                 name: "CALL update_article_title_pcd($1,$2,$3);",
                 object: [req.user.id, text, articleId]
             }
         }
         if (name === 'description') {
             context = text
             execute_update = {
                 name: "CALL update_article_desc_pcd($1,$2,$3);",
                 object: [req.user.id, text, articleId]
             }
         }
         if (name === 'imageDescription') {
             context = text
             execute_update = {
                 name: "CALL update_article_image_desc_pcd($1,$2,$3);",
                 object: [req.user.id, text, articleId]
             }
         }
         if (context && context.length > 175) {
             return res.json({
                 error: "description text exceeds 175 characters limit", name: name
             })
         } else {
             await pool.query(execute_update.name, execute_update.object)
             return res.json(`update article ${execute_update.name} text success!`)
         }

     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })

 router.post("/update/body", authorization, checkArticlePublished, async (req, res) => {
     const {body, articleId} = req.body;
     try {
         const doubleBody = body.replace( /(<([^>]+)>)|&nbsp;/ig, '')
         if (doubleBody && doubleBody.length > 10500)
             return res.status(401).json({
                 error: 'true',
                 errorImgDescription: "body text exceeds 10500 characters limit"
             })
         const get_article = await pool.query("SELECT body FROM view_article_id_func($1, $2);", [req.user.id, articleId])
         const params = ({
             Bucket: bucketName,
             Key: get_article.rows[0].body,
             // Body: JSON.stringify(body),
             Body: body,
             ContentType: 'text',
             ACL: 'public-read',
         })
         await s3.putObject(params).promise()
         return res.json('Article body text updated successfully!')
     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })

router.post("/upload/image", authorization, imageUrlGenerator, upload.single('image'), checkArticlePublished, async (req, res) => {
    const {name, articleId, remove} = req.body;

    let image = {name: "", object: []}
    let execute_upload = {name: "", object: []}
    let execute_delete = {name: "", object: []}
    try {
        if (name === 'image') {
            image = {
                name: "SELECT image FROM view_article_id_func($1,$2);",
                object: [req.user.id, articleId]
            }
            execute_upload = {
                name: "CALL update_article_image_pcd($1,$2,$3);",
                object: [req.user.id, req.do_url.split('?')[0], articleId]
            }
        }
        if (name === 'imageL') {
            image = {
                name: "SELECT imagel FROM view_article_id_func($1,$2);",
                object: [req.user.id, articleId]
            }
            execute_upload = {
                name: "CALL update_article_image_l_pcd($1,$2,$3);",
                object: [req.user.id, req.do_url.split('?')[0], articleId]
            }
        }
        if (name === 'imageW') {
            image = {
                name: "SELECT imagew FROM view_article_id_func($1,$2);",
                object: [req.user.id, articleId]
            }
            execute_upload = {
                name: "CALL update_article_image_w_pcd($1,$2,$3);",
                object: [req.user.id, req.do_url.split('?')[0], articleId]
            }
        }

        if (!image) {
            return res.json("Sorry no image have been uploaded!")
        }
        if (remove) {
            if (name === 'image') {
                execute_delete = {
                    name:"CALL update_article_image_pcd($1,$2,$3);",
                    object: [req.user.id, null, articleId]
                }
            }
            if (name === 'imageL') {
                execute_delete = {
                    name:"CALL update_article_image_l_pcd($1,$2,$3);",
                    object: [req.user.id, null, articleId]
                }
            }
            if (name === 'imageW') {
                execute_delete = {
                    name:"CALL update_article_image_w_pcd($1,$2,$3);",
                    object: [req.user.id, null, articleId]
                }
            }
            const get_article_image = await pool.query(image.name, image.object)
            const keyname = Object.values(get_article_image.rows[0])[0].split('digitaloceanspaces.com/')[1];
            await s3.deleteObject({
                Key: keyname,
                Bucket: bucketName
            }).promise()
            await pool.query(execute_delete.name, execute_delete.object)
            return res.json("Image have been deleted successfully")
        }

        await axios.put(
            req.do_url, // The url which was generated
            req.file.buffer,
            { // Using your own json object
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': 'image/jpeg',
                    'x-amz-acl': 'public-read',
                },
            })
        await pool.query(execute_upload.name, execute_upload.object)
        return res.json("Image have been uploaded successfully!")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

router.post("/view/article_by_home", authorization, async (req, res) => {
    let {name, type, topic, search} = req.body;

    let execute_view = {name: "", object: []}
    if (search){
        search =`%${search}%`
    }
    try {
        if (name === 'modifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) ORDER BY modifieddate DESC;",
                object: [req.user.id]
            }
        }
        if (name === 'publishedByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE publisheddate IS NOT NULL ORDER BY title ASC;",
                object: [req.user.id]
            }
        }
        if (name === 'publishedByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE publisheddate IS NOT NULL ORDER BY modifieddate DESC ;",
                object: [req.user.id]
            }
        }

        if (name === 'publishedTypeByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE typename = $2 AND publisheddate IS NOT NULL ORDER BY modifieddate DESC ;",
                object: [req.user.id, type]
            }
        }
        if (name === 'publishedTypeByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE typename = $2 AND publisheddate IS NOT NULL ORDER BY title ASC ;",
                object: [req.user.id, type]
            }
        }

        if (name === 'publishedTypeTopicByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_all_article_func() WHERE topicname = $1 AND typename = $2 AND publisheddate IS NOT NULL ORDER BY modifieddate DESC ;",
                object: [topic, type ]
            }
        }
        if (name === 'publishedTypeTopicByTitle') {
            execute_view = {
                name: "Select *  FROM view_all_article_func() WHERE topicname = $1 AND typename = $2 AND publisheddate IS NOT NULL ORDER BY title ASC ;",
                object: [topic, type]
            }
        }

        //==============================================================================================================
        //==============================================================================================================
        //==============================================================================================================

        if (name === 'inReviewByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NOT NULL AND publisheddate IS NULL ORDER BY title ASC;",
                object: [req.user.id]
            }
        }
        if (name === 'inReviewByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NOT NULL AND publisheddate IS NULL ORDER BY modifieddate DESC ;",
                object: [req.user.id]
            }
        }

        if (name === 'inReviewTypeByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NOT NULL AND publisheddate IS NULL AND typename = $2 ORDER BY modifieddate DESC ;",
                object: [req.user.id, type]
            }
        }
        if (name === 'inReviewTypeByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NOT NULL AND publisheddate IS NULL AND typename = $2 ORDER BY title ASC;",
                object: [req.user.id, type]
            }
        }

        //==============================================================================================================
        //==============================================================================================================
        //==============================================================================================================

        if (name === 'draftByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NULL   ORDER BY title ASC;",
                object: [req.user.id]
            }
        }
        if (name === 'draftByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NULL   ORDER BY modifieddate DESC ;",
                object: [req.user.id]
            }
        }

        if (name === 'draftTypeByModifiedDate') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NULL  AND typename = $2 ORDER BY modifieddate DESC ;",
                object: [req.user.id, type]
            }

        }
        if (name === 'draftTypeByTitle') {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE inreviewdate IS NULL  AND typename = $2 ORDER BY title ASC ;",
                object: [req.user.id, type]
            }
        }

        //==============================================================================================================
        //==============================================================================================================
        //==============================================================================================================

        if (name === 'searchStudio' && search) {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE LOWER(title) LIKE LOWER($2) ORDER BY modifieddate DESC;",
                object: [req.user.id, search]
            }
        }
        if (name === 'searchStudioByTitle' && search) {
            execute_view = {
                name:"Select *  FROM view_article_func($1) WHERE LOWER(title) LIKE LOWER($2) ORDER BY title ASC;",
                object: [req.user.id, search]
            }
        }
        if (name === 'searchStudioTypeByModifiedDate' && search) {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE LOWER(title) LIKE LOWER($2) AND typeName = $3 ORDER BY modifieddate DESC;",
                object: [req.user.id, search, type]
            }
        }
        if (name === 'searchStudioTypeByTitle' && search) {
            execute_view = {
                name: "Select *  FROM view_article_func($1) WHERE LOWER(title) LIKE LOWER($2) AND typeName = $3 ORDER BY title ASC;",
                object: [req.user.id, search, type]
            }
        }
        const result = await pool.query(execute_view.name, execute_view.object)
        return res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/delete/article_by_id", authorization, async (req, res) => {
    const {name} = req.body;
    try {
        let get_article = await pool.query("SELECT * FROM view_article_id_func($1,$2);", [req.user.id, name])
        let articleBodyS3 = [get_article.rows[0].body, get_article.rows[0].image, get_article.rows[0].imagew, get_article.rows[0].imagel, get_article.rows[0].audio]
        for (let element of articleBodyS3) {
            if (element !== null) {
                if (element.includes('digitaloceanspaces'))
                    element = element.split('digitaloceanspaces.com/')[1]
                await s3.deleteObject({
                    Key: element,
                    Bucket: bucketName
                }).promise()
            }
        }
        await pool.query("CALL delete_article_pcd($1);", [name])
        return res.json("Article deleted successfully")

    }catch (err){
        console.error(err.message)
        res.status(500).send("server Error")
    }
})


router.post("/view/article_type_topic", authorization, async (req, res) => {
    const {name} = req.body;
    let execute_view = {name: "", object: []}
    try {
        if (name === 'topicNames') {
            execute_view = {
                name: "Select article_topic_name  FROM article_topic ORDER BY created_on ASC;",
                object: []
            }
        }
        if (name === 'typeNames') {
            execute_view = {
                name: "Select article_type_name  FROM article_type ORDER BY created_on DESC",
                object: []
            }
        }
        const result = await pool.query(execute_view.name)
        return res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

 router.post("/publish/article", authorization, imageUrlGenerator, async (req, res) => {
     const {articleId} = req.body;
     const rawBytesAID = await randomBytes(10)
     let articlePId = rawBytesAID.toString('hex')
     try {
         const checkATopic = await pool.query("SELECT * FROM view_article_id_func($1,$2);", [req.user.id, articleId])
         const images = [checkATopic.rows[0].image, checkATopic.rows[0].imagel, checkATopic.rows[0].imagew]
         let Imageerror;
         let run = 0

         for (const element of images) {
             sightengine(sightengineApiUser, sightengineApiSecret)
                 .check(['nudity', 'gore'])
                 .set_url(element)
                 .then(async (response) => {
                     const nudity = response.nudity
                     const gore = response.gore
                     if (nudity && nudity.safe && nudity.safe < 0.17 && !Imageerror) {
                         Imageerror = {error: 'Sorry one of your images has been flagged for nudity. Please remove and upload another image and try to submit again.'}
                         return res.json(Imageerror)
                     }

                     if (gore && gore.prob && gore.prob > 0.30 && !Imageerror) {
                         Imageerror = {error: 'Sorry one of your images has been flagged for gore. Please remove and upload another image and try to submit again.'}
                         return res.json(Imageerror)
                     }

                     run += 1
                     if (run > 2 && !Imageerror) {
                         let bodyS3 = await s3.getObject({Bucket: bucketName, Key: checkATopic.rows[0].body}).promise()
                         bodyS3 = bodyS3.Body.toString('utf-8')
                         bodyS3 = bodyS3.replace(/(\r\n|\\n|\n|\r)/gm, '')
                         bodyS3 = bodyS3.replace("&nbsp;", "")

                         const adverb = checkATopic.rows[0].typename && (checkATopic.rows[0].typename === 'Opinion' || checkATopic.rows[0].typename === 'Analysis') ? 'an' : 'a'
                         const month = new Date().toLocaleString("en-US", {month: "long"})// December
                         let day = new Date().toLocaleString("en-US", {day: "numeric"})

                         const ordinal_suffix_of = (i) => {
                             const j = i % 10,
                                 k = i % 100;
                             if (j === 1 && k !== 11) {
                                 return i + "st";
                             }
                             if (j === 2 && k !== 12) {
                                 return i + "nd";
                             }
                             if (j === 3 && k !== 13) {
                                 return i + "rd";
                             }
                             return i + "th";
                         }
                         day = ordinal_suffix_of(day)
                         const year = new Date().toLocaleString("en-US", {year: "numeric"})
                         const time = new Date().toLocaleString("en-US", {hour: "numeric"})
                         const date = ` ${month} ${day} ${year} at ${time}`
                         const preText = `This is ${adverb} ${checkATopic.rows[0].typename} from ${checkATopic.rows[0].topicname}. Title:  ${checkATopic.rows[0].title}. Posted on ${date} written by ${checkATopic.rows[0].fullname}.`
                         const client = new textToSpeech.TextToSpeechClient();
                         bodyS3 = bodyS3.replace(/(\r\n|\\n|\n|\r)/gm, '')
                         bodyS3 = bodyS3.slice(1, -1)
                         bodyS3 = bodyS3.replace(/(<([^>]+)>)/gi, "")
                         const text = preText + bodyS3;

                         // Construct the request
                         const request = {
                             input: {text: text},
                             // Select the language and SSML voice gender (optional)
                             voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
                             // select the type of audio encoding
                             audioConfig: {audioEncoding: 'MP3'},
                         };

                         // Performs the text-to-speech request
                         const [response] = await client.synthesizeSpeech(request);

                         // Write the binary audio content to a local file
                         await axios.put(
                             req.do_url, // The url which was generated
                             response.audioContent,
                             { // Using your own json object
                                 maxContentLength: Infinity,
                                 maxBodyLength: Infinity,
                                 headers: {
                                     'Content-Type': 'audio/mpeg',
                                     'x-amz-acl': 'public-read',
                                 },
                             })
                         console.log('Audio content written to file: output.mp3');
                         if (checkATopic.rows[0].typename !== 'Opinion') {
                             await pool.query("CALL publish_article_pcd($1,$2,false,$3);", [articlePId, req.body.articleId,req.do_url.split('?')[0]])
                             console.log("Non Opinion article publish for review successfully!")
                             return res.json("Non Opinion article publish for review successfully!")
                         }
                         await pool.query("CALL publish_article_pcd($1,$2, true,$3);", [articlePId, req.body.articleId, req.do_url.split('?')[0]])
                         console.log("Opinion article publish successfully!")
                         return res.json("Opinion article publish successfully!")
                     }
                 })
                 .catch(function (e) {
                     if (e.response) {
                         console.log(e.response.data);
                         // return res.json({error: e.response.data})
                     } else {
                         console.log(e.message);
                         // return res.json({error: e.message})
                     }

                 })
         }
     } catch (err) {
         console.error(err.message)
         res.status(500).send("Server Error")
     }
 })

router.post("/update_publish/article", authorization, async (req, res) => {
    const {articleId} = req.body;

    try {
        await pool.query("CALL update_publish_article_pcd($1, NULL);", [articleId])
        return res.json("Non Opinion article publish successfully")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/view/row_article", authorization, async (req, res) => {
    const {topic} = req.body;
    let execute_pu = {name: "", object: []}
    try {
        if (req.body.name === 'viewRowByTopic') {
            execute_pu = {
                name: "SELECT * FROM view_article_row_by_name_func($1,$2);",
                object: [req.user.id, topic]
            }
        }
        const result = await pool.query(execute_pu.name, execute_pu.object)
        return res.json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})



router.post("/update/row_article", authorization, async (req, res) => {
    const {topic} = req.body;

    try {
        const execute_view = await pool.query("SELECT * FROM view_article_row_by_name_func($1,$2);", [req.user.id, req.body.topic])

        let newRow = {
            RowHOne: execute_view.rows[0].articlehone,
            RowHTwo: execute_view.rows[0].articlehtwo,
            RowHThree: execute_view.rows[0].articlehthree,
            RowHFour: execute_view.rows[0].articlehfour,
            RowSOne: execute_view.rows[0].articlesone,
            RowSTwo: execute_view.rows[0].articlestwo,
            RowSThree: execute_view.rows[0].articlesthree,
            RowSFour: execute_view.rows[0].articlesfour,
        }

        newRow = update(newRow, {$merge: req.body})

        await pool.query("CALL update_article_row_pcd($1,$2,$3, $4, $5, $6, $7, $8, $9, $10);",
            [
                req.user.id, newRow.RowHOne ? newRow.RowHOne : null,
                newRow.RowHTwo ? newRow.RowHTwo : null,
                newRow.RowHThree ? newRow.RowHThree : null,
                newRow.RowHFour ? newRow.RowHFour : null,
                newRow.RowSOne ? newRow.RowSOne : null,
                newRow.RowSTwo ? newRow.RowSTwo : null,
                newRow.RowSThree ? newRow.RowSThree : null,
                newRow.RowSFour ? newRow.RowSFour : null,
                topic
            ])

        return res.json("Row article updated successfully!")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

router.post("/article_data_chart", authorization, async (req, res) => {
    const {articleId} = req.body;
    try {
        const commentCount = await pool.query("Select count(*)  FROM get_comment_list_view WHERE article_published_id = $1;", [articleId])
        const replyCount = await pool.query("Select count(*)  FROM view_all_comment_count WHERE article_published_id = $1;", [articleId])
        const likeCount = await pool.query("Select count(*)  FROM get_article_like_list_view WHERE publishid = $1;", [articleId])
        const historyCount = await pool.query("Select count(*)  FROM get_history_admin_list_view WHERE article_published_id = $1;", [articleId])
        const readCount = await pool.query("Select count(*)  FROM get_read_article_list_view WHERE article_published_id = $1;", [articleId])
        let readDateCount = await pool.query("Select *  FROM get_article_read_count_func($1);", [articleId])

        let updateReadDateCount = []
        for (let element of readDateCount.rows){
            const newDate = new Date(element.day).toLocaleString("en-US").split(',')[0]
            element = update(element,{$merge: {day: newDate}})
            updateReadDateCount = update(updateReadDateCount, {$push: [element]})
        }
        readDateCount = updateReadDateCount

        const data_info = {
            allCommentCount: parseInt(commentCount.rows[0].count) + parseInt(replyCount.rows[0].count),
            likeCount: likeCount.rows[0].count,
            historyCount: historyCount.rows[0].count,
            readCount: readCount.rows[0].count,
            readDateCount: readDateCount
        }
        return res.json(data_info)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})



module.exports = router;