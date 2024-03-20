const express = require("express");
const pg_promise = require("pg-promise")();
const fs = require('fs');
// const pg_promise = require("pg-promise")
const bodyParser = require("body-parser");
const node_cache = require("node-cache");
const { randomBytes } = require("crypto");
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
    .then(function(data) {
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
                    if(counter == data.length) {
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
    then(function(data) {
        data.forEach((obj) => {
            db.any(`SELECT user_id, name from users where user_id=${obj.user_id}`).
            then(function(user) {
                // console.log(user);
                groupDetails.push(user[0]);
                counter++;
                if(counter == data.length) {
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
    db.any(`select mailid from users where mailid = ${payload.mailid}`).then(
        function(data){
            console.log(data)
            if(data.length == 0) {
                    //TODO: Implement redis
                    //storing in local cache using node-cache package
                    console.log('setting it in the cache')
                    cache.set(payload?.mailid, payload, 600)
                    let otp = randomValueGenerator();
                    res.send({otp: otp})
            }
        }
    )
    //check db if the phone number exists or not
    //if not, add the details to redis table 
    //send a otp to the user
    //store the otp in the redis table and increase the counter
    // res.send("some");
});

app.post('/verifyotp', (req, res)=> {
    console.log(req)
    //query the redis table with the phone number and get the otp
    //check if it matches with the otp we got
    //if yes, add the person details to the final users table in the db
})

app.listen(PORT, () => {
    console.log(`application running on ${PORT}`);
});