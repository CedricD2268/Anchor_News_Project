const aws = require('aws-sdk');
require("dotenv").config()
const crypto = require('crypto')
const { promisify } = require('util')
const axios = require("axios");
const randomBytes = promisify(crypto.randomBytes)

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

module.exports = async (req, res, next) => {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        ACL: 'public-read',
        Expires: 60
    })
    req.do_url = await s3.getSignedUrlPromise('putObject', params)
    // req.do_url = await s3.listObjectsV2({
    //     Bucket: bucketName
    // }).promise()
    next();
}