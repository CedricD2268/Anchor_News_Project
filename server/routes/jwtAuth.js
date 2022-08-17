const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");
const googleAuth = require("../middleware/googleAuth");
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {promisify} = require('util')
const {faker} = require('@faker-js/faker');
const path = require("path");
const resetAuthorization = require("../middleware/resetAuthorization");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const randomBytes = promisify(crypto.randomBytes)
require('dotenv').config();
process.env.TZ = "UTC";

const region = process.env.DO_SPACE_REGION
const bucketName = process.env.DO_SPACE_NAME
const accessKeyId = process.env.DO_SPACE_KEY
const secretAccessKey = process.env.DO_SECRET_KEY

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})



//{FUNCTION, PROCEDURE} = QUERIES

//FUNCTION:
// get_user_account_func(email) THIS FUNCTION RETURNS USER ACCOUNT INFO (
//* id: ACCOUNT ID,
//* email: ACCOUNT EMAIL,
//* password: ACCOUNT PASSWORD,
//* media_id: SOCIAL MEDIA ID (GOOGLE)
//* user_name: ACCOUNT USERNAME
//* media_name: GOOGLE OR EMAIL
//* group_name: ADMIN, USER, OR CLONE
// )




//THIS ROUTER HANDLES NEW USER WHOSE REGISTERING
router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [email])
        //CHECK IF USER EXIST
        if (user.rows.length !== 0) {
            if (user.rows[0].media_name === 'google') {
                return res.status(401).json("Your account is linked to your social network. Click on the social media button to access")
            } else {
                return res.status(401).json("Sorry! User already exist.")
            }
        }

        //MAKING SURE USER PASSWORD IS SECURE BY NOT REVEALING IT ON THE DATABASE TABLE
        const salt = await bcrypt.genSalt(10)
        const bcryptPassword = await bcrypt.hash(password, salt)

        //CREATING A USERNAME FOR USERS BECAUSE WHEN REGISTERING WE DIDNT ASK
        const rawBytesAID = await randomBytes(5)
        let userName = rawBytesAID.toString('hex')
        userName = `User_${userName}`

        // THIS QUERY IS A PROCEDURE FROM POSTGRESQL. REQUIRES AN EMAIL AND IT WILL CREATE DEFAULT TABLES FOR USERS
        // TABLES: PROFILE (USER_NAME, ETC..), TOPIC_DEFAULT_LIST, WEATHER
        await pool.query("CALL create_user_account_pcd( $1, $2, 'email', 'user', NULL, false, NULL, NULL, $3 );", [email, bcryptPassword, userName])

        //AFTER CREATING USER, USER INFO WILL BE SENT ALONG WITH A JWT TOKEN AS A COOKIE ON THE FRONT END FOR AUTHENTICATION
        const newUser = await pool.query("SELECT * FROM get_user_account_func($1);", [email])
        //JWTGENERATOR IS A MIDDLEWARE THAT CREATE NEW TOKEN. HELPS REDUCE CODE
        const token = jwtGenerator(newUser.rows[0]);

        //COOKIE IS CREATED AND SENT TO THE FRONT END, TOKEN IS VARIABLES THAT HELPS WITH FRONT END LOAD
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        }).send({token: true})

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS ROUTER HANDLES USER LOGIN IN
router.post("/login", async (req, res) => {
     const {email, password} = req.body;

    try {

        //THIS QUERY IS A FUNCTION FROM POSTGRESQL IVE CREATED IT REQUIRES AN EMAIL AND IT WILL RETURN USER INFO IF IT EXIST
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [email])

        //CHECK IF USER EXIST
        if (user.rows.length === 0) {
            return res.status(401).json("Invalid email or password")
        }

        //CHECK IF USER CREDENTIALS ARE VERIFIED
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json("Invalid email or password")
        }

        //IF USER INFO IS VERIFIED A TOKEN WILL BE SENT TO THEM FOR AUTHENTICATION
        const token = jwtGenerator(user.rows[0])
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        }).send({token: true})

    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS ROUTER VERIFIES TOKEN AND LOG OUT USER IF TOKEN IS EXPIRED OR A FAKE WAS GIVEN.
router.get("/verify", authorization, async (req, res) => {
    try {
        return res.json({token: true})
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS ROUTER HANDLES USER LOGIN IN WITH THEIR PREFERRED SOCIAL MEDIA PLATFORM(ONLY GOOGLE RIGHT NOW).
router.post("/google/verify", googleAuth, async (req, res) => {
    try {
        const g_user = req.userInfo;

        //CHECK IF USER ALREADY EXIST EITHER FROM REGULAR EMAIL OR SOCIAL MEDIA.
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [g_user.email]);
        if (user.rows.length !== 0) {
            if (user.rows[0].media_name === 'email')
                return res.status(401).json("This email is already in use. To link your social network to your account, log in into New Jersey Times and connect your social account from your profile.")

            const validId = await bcrypt.compare(g_user.userId, user.rows[0].media_id);

            if (!validId)
                return res.status(401).json("Invalid google account")

            const token = jwtGenerator(user.rows[0]);
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
            }).send({token: true})


        } else {
            //WHEN CREATING A USER WITH SOCIAL MEDIA PASSWORD WILL BE NULL AND SOCIAL MEDIA USER_NAME WILL BE USE AUTHENTICATION
            const salt = await bcrypt.genSalt(10)
            const bcryptId = await bcrypt.hash(g_user.userId, salt)
            const rawBytesAID = await randomBytes(5)
            let userName = rawBytesAID.toString('hex')
            userName = `User_${userName}`
            await pool.query("CALL create_user_account_pcd( $1, NULL, 'google', 'admin', $2, true, $3, $4, $5);", [g_user.email, bcryptId, g_user.fullName, g_user.photoUrl, userName])

            const newUser = await pool.query("SELECT * FROM get_user_account_func($1);", [g_user.email])

            //IF USER IS AN ADMIN NEW TABLES WILL BE CREATED FOR THAT USER.
            // TABLES: TABLE_ROW(ABILITY TO SELECT WHAT ARTICLE CAN BE SHOWN FOR SUCH TOPIC) AND ETC...
            if (newUser.rows[0].group_name = 'admin') {
                const topicNames = await pool.query("SELECT article_topic_name FROM article_topic;")
                for (const row of topicNames.rows) {
                    let rawBytesRowID = await randomBytes(16)
                    let rowId = rawBytesRowID.toString('hex')
                    let rawBytesRowTwoID = await randomBytes(16)
                    let rowTwoId = rawBytesRowTwoID.toString('hex')
                    await pool.query("CALL create_row_account_pcd( $1, $2, $3, $4);", [g_user.email, rowId, rowTwoId, Object.values(row)[0]])
                }
            }

            const token = jwtGenerator(newUser.rows[0])
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
            }).send({token: true})
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS ROUTER IS FOR USER THAT WANT TO TRY OUT THE APP WITHOUT PUTTING THEIR CREDENTIALS AND AFTER THEY LOG OUT THAT CLONE USER INFO WILL BE DELETED
//NAME, USER_NAME, EMAIL ARE ALL CREATED USING FAKER-JS
router.get("/clone_login", async (req, res) => {
    try {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const fullName = `${firstName} ${lastName}`
        const fakeEmail = faker.internet.email(firstName, lastName, 'example.njanchor.test');
        const rawBytesAID = await randomBytes(5)
        let userName = rawBytesAID.toString('hex')
        userName = `User_${userName}`
        await pool.query("CALL create_user_account_pcd( $1, NULL, 'email', 'clone', NULL, false, $2, NULL, $3);", [fakeEmail, fullName, userName])

        const newUser = await pool.query("SELECT * FROM get_user_account_func($1);", [fakeEmail])
        const token = jwtGenerator(newUser.rows[0])
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        }).cookie("fakeEmail", fakeEmail).send({token: true})
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LOGOUT WILL HAPPEN WHEN COOKIE IS CLEAR, CLONE LOGIN WILL BE DELETED IF IT WAS CREATED.
//CLONE USER ARTICLE IMAGES, BODY TEXT AND AVATAR WILL BE DELETED HERE.
router.get("/logout",  async (req, res) => {
    try {
        const cloneEmail = req.cookies.fakeEmail;
        if (cloneEmail) {
            const fake_user = await pool.query("SELECT * FROM get_user_account_func($1);", [cloneEmail]);
            const view_user_url = await pool.query("SELECT avatarlocation FROM view_user_account_profile_func($1);", [fake_user.rows[0].id])
            if (view_user_url && view_user_url.rows[0] && view_user_url.rows[0].avatarlocation && view_user_url.rows[0].avatarlocation.includes('digitaloceanspaces.com')) {
                const keyname = view_user_url.rows[0].avatarlocation.split('digitaloceanspaces.com/')[1];
                await s3.deleteObject({
                    Key: keyname,
                    Bucket: bucketName
                }).promise()
            }
            const articles =  await pool.query("Select *  FROM view_article_func($1) ", [fake_user.rows[0].id])
            if (articles.rows) {
                for (const element of articles.rows) {
                    const data = [
                        element.body ? element.body: null,
                        element.image ? element.image.split('digitaloceanspaces.com/')[1]: null,
                        element.imagew ? element.imagew.split('digitaloceanspaces.com/')[1]: null,
                        element.imagel ? element.imagel.split('digitaloceanspaces.com/')[1]: null,
                        element.audio ? element.audio.split('digitaloceanspaces.com/')[1]: null
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
            await pool.query("CALL delete_clone_user_pcd($1)", [cloneEmail])
        }
        res.clearCookie("token")
        res.clearCookie("fakeEmail")
        return res.json({token: false})
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})


router.post("/identification", async (req, res) => {
    const {email} = req.body;
    try {
        const user = await pool.query("SELECT * FROM get_user_account_func($1);", [email])
        if (user.rows.length !== 0) {
            if (user.rows[0].media_name === 'google') {
                return res.status(401).json("Your account is linked to your social network. Click on the social media button for access")
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'douillard1234@gmail.com',
                    pass: 'uckclbfcnjshvniw'
                }
            });


            const handlebarOptions = {
                viewEngine: {
                    extName: ".handlebars",
                    partialsDir: path.resolve('./views'),
                    defaultLayout: false,
                },
                viewPath: path.resolve('./views'),
                extName: ".handlebars",
            }


            transporter.use('compile', hbs(handlebarOptions));
            // const token = jwtResetGenerator(user.rows[0]);
            const payload = {
                user: user.rows[0]
            }
            const secret = process.env.jwtResetSecret + user.rows[0].password
            const token = jwt.sign(payload, secret, {expiresIn: "1hr"})

            const mailOptions = {
                from: 'douillard1234@gmail.com',
                to: "douillard12345@gmail.com",
                subject: 'New Jersey Anchor password reset',
                template: 'resetEmail',
                context: {
                    PASSWORD_RESET_LINK: `http://localhost:3000/accounts/login/reset/${user.rows[0].email}/${user.rows[0].user_name}/${token}`,
                }
            };

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(401).json("This email is not associated with us.")
                } else {
                    console.log('success');
                }
            });

            return res.json({email: true})
        }

        return res.status(401).json("This email is not associated with us.")


    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/reset/password", resetAuthorization, async (req, res) => {
    const {password} = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const bcryptPassword = await bcrypt.hash(password, salt)
        await pool.query("CALL update_user_password_pcd($1, $2);", [req.user.id, bcryptPassword])
        console.log('Password Changed')
        return res.json({password: true})
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
})


module.exports = router;