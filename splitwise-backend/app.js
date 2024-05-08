//package imports
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

//code imports
const { signup } = require("./src/api/components/auth/signup")
const { signin } = require("./src/api/components/auth/signin")
const { getGroupsOfAUser } = require("./src/api/components/groups/getGroupsOfAUser")
const { getAllMembersOfAGroup } = require("./src/api/components/groups/getAllMembersOfAGroup")
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

//get all the groups a user belongs to
APP.get('/groups/:user_id', (req, res) => getGroupsOfAUser(req, res));

//get all the members of a certain group
APP.get('/groupmembers/:group_id', (req, res) => getAllMembersOfAGroup(req, res));

//validate the otp
APP.post('/validateotp', (req, res) => validateOTP(req, res));


//listening to the incoming requests
APP.listen(PORT, () => {
    console.log(`APPlication running on ${PORT}`);
});