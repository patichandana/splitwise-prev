const express = require("express");
const pg_promise = require("pg-promise")();
const fs = require('fs');
// const pg_promise = require("pg-promise")
const bodyParser = require("body-parser");
const node_cache = require("node-cache");
const nodeMailer = require("nodemailer");
require('dotenv').config();

// const { randomBytes } = require("crypto");

const PORT = 3000;

// console.log(a)
// console.log(pg_promise)

const app = express();
const db = pg_promise({
    host: "192.168.228.2",
    port: 5432,
    database: "postgres_db",
    user: "postgres_user",
    password: "password"
});
const cache = new node_cache();
const transportor = nodeMailer.createTransport(
    {
        port: 587,
        host: 'smtp.sendgrid.net',
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        },
        // secure: true
        tls: {
            ciphers: 'SSLv3'
        }
    }
);
// console.log(express);
// console.log(app);
// console.log(db);

//get groups

// app.all('*', (req, res, next) => {
//     //may be we'd configure auth here
//     //if the user is authenticated, then we go to the appropriate next callback?
// });

//get all the groups the user is part of

// app.use(bodyparser)

function randomValueGenerator() {
    return Math.random().toString().substring(2, 8);
}

app.use(bodyParser.json());

app.get('/groups/:user_id', (req, res) => {
    console.log(res);
    // res.send("Hello world");
    userGroups = []
    user_id = req.params.user_id
    counter = 0
    console.log(user_id)
    db.any(`SELECT group_id FROM groupmembers WHERE user_id=${user_id}`)
        .then(function (data) {
            // res.send(data);
            // console.log(data);
            data.forEach((obj) => {
                db.any(`SELECT group_name, group_id FROM groups where group_id=${obj.group_id}`).
                    then(function (group) {
                        console.log(obj, group);
                        userGroups.push(group[0]);
                        console.log(userGroups);
                        console.log(counter, data.length)
                        ++counter;
                        if (counter == data.length) {
                            console.log("entered")
                            console.log(counter, data.length)
                            res.send(JSON.stringify(userGroups));
                        }
                    });
            })
        })

});

//get all the members of a certain group
app.get('/groupmembers/:group_id', (req, res) => {
    group_id = req.params.group_id;
    groupDetails = []
    console.log(group_id)
    counter = 0;
    db.any(`SELECT user_id from groupmembers where group_id=${group_id}`).
        then(function (data) {
            data.forEach((obj) => {
                db.any(`SELECT user_id, name from users where user_id=${obj.user_id}`).
                    then(function (user) {
                        // console.log(user);
                        groupDetails.push(user[0]);
                        counter++;
                        if (counter == data.length) {
                            res.send(JSON.stringify(groupDetails))
                        }
                    })
            })
        })

});

app.post('/signup', (req, res) => {
    console.log(req.body);
    payload = req.body;
    //verify if the req body has both the params and have valid data
    db.any(`select email_id from users where email_id = '${payload.EmailId}'`).then(
        function (data) {
            console.log(data)
            if (data.length == 0) {
                //TODO: Implement redis
                //storing in local cache using node-cache package
                console.log('setting it in the cache')
                let otp = randomValueGenerator();
                //send otp to mail id
                const mailData = {
                    from: process.env.FROM_MAIL_ID,
                    to: payload?.EmailId,
                    subject: 'splitwise signup',
                    text: `Your OTP is ${otp}. Please Enter this number and validate yourself in the application`
                }
                // console.log(transportor)
                transportor.sendMail(mailData, (error, info) => {
                    if (error) {
                        res.status(500).send({ 'status': 'internal server error' })
                        console.log(error)
                    } else {
                        res.status(200).send({ 'status': 'otp sent' })
                        cache.set(payload?.EmailId, { ...payload, "OTP": otp }, 600000)
                    }
                })
            } else {
                res.status(201).send({ 'status': 'user already exists' })
            }
        }
    )
    //check db if the phone number exists or not
    //if not, add the details to redis table 
    //send a otp to the user
    //store the otp in the redis table and increase the counter
    // res.send("some");
});

app.post('/validateotp', (req, res) => {
    // console.log(req.body)
    let payload = req.body
    console.log(payload)
    let cachedObject = cache.get(payload?.EmailId)
    console.log(cachedObject)
    if (payload.OTP == cachedObject?.OTP) {
        console.log("OTP matches. Adding the person to the db")
        //TODO: remove hardcoded password
        //TODO: send cookies?
        db.any('INSERT INTO USERS(email_id, password, name) VALUES($1, $2, $3)', [cachedObject.EmailId, "password", cachedObject.Name]).then(
            function (data) {
                console.log(data);
                res.status(200).send({ "status": "success" });
            }
        )
    } else {
        res.send({ "status": "failure", "reason": "wrong otp" })
    }
    // res.status(300).send('smtng')
})

app.listen(PORT, () => {
    console.log(`application running on ${PORT}`);
});