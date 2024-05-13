//package imports
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

//code imports
const {validateJwtToken} = require("./src/api/components/auth/services/validateJwtToken")
const { signup } = require("./src/api/components/auth/services/signup")
const { signin } = require("./src/api/components/auth/services/signin")
const { getGroupsOfAUser } = require("./src/api/components/groups/getGroupsOfAUser")
const { getAllMembersOfAGroup } = require("./src/api/components/groups/getAllMembersOfAGroup")
const { addGroup } = require("./src/api/components/groups/addGroup")
const { removeGroup } = require("./src/api/components/groups/removeGroup")
const { validateOTP } = require("./src/api/components/auth/services/validateOTP")
const {addTransaction} = require("./src/api/components/transactions/addTransaction")
const {editTransaction} = require("./src/api/components/transactions/editTransaction")
const {removeTransaction} = require("./src/api/components/transactions/removeTransaction")


//constants declaration
const PORT = 3000;
const APP = express();

//common functions
function randomValueGenerator() {
    return Math.random().toString().substring(2, 8);
}

APP.use(bodyParser.json());

//sign up code
APP.post('/signup', (req, res) => signup(req, res));

//sign in code
APP.post('/signin', (req, res) => signin(req, res));

//validating the jwt token
let user_id;
APP.use((req, res, next) => {
    user_id = validateJwtToken(req, res);
    if(user_id != undefined)
        next();
});

//add a group
APP.post('/groups/', (req, res) => addGroup(req, res, user_id))

//get all the groups a user belongs to
APP.get('/groups/', (req, res) => getGroupsOfAUser(req, res));

//get all the members of a certain group
APP.get('/groupmembers/:group_id', (req, res) => getAllMembersOfAGroup(req, res));

//validate the otp
APP.post('/validateotp', (req, res) => validateOTP(req, res));


//listening to the incoming requests
APP.listen(PORT, () => {
    console.log(`APPlication running on ${PORT}`);
});