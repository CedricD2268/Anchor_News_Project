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
const emailjs = require('@emailjs/browser')
const {faker} = require('@faker-js/faker');
const path = require("path");
const resetAuthorization = require("../middleware/resetAuthorization");
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');
const aws = require("aws-sdk");
require('dotenv').config();
const randomBytes = promisify(crypto.randomBytes)
const State = require('country-state-city').City;
process.env.TZ = "UTC";


router.post("/weather", authorization, async (req, res) => {
    const {cityName, stateName} = req.body
    let getCity
    try {

        const cityQuery = State.getCitiesOfState('US', stateName).filter(el => el.name === cityName.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' '))

        if (cityQuery && cityQuery.length){
            getCity = cityQuery[0]
        }else{
            return res.json({error: true})
        }

        const key = process.env.REACT_APP_WEATHER_API_KEY;
        // const response = await fetch(`https://api.openweathermap.org/data/3.0/weather?q=${cityName}, US-${stateName},US&appid=${key}`)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getCity.latitude}&lon=${getCity.longitude}&appid=${key}&units=imperial`)

        const parseRes = await response.json()

        return res.json(parseRes)

    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})





module.exports = router;