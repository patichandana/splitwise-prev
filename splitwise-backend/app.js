//package imports
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

//code imports
const {validateJwtToken} = require("./src/api/components/auth/services/validateJwtToken")
const { validateOTP } = require("./src/api/components/auth/services/validateOTP")
const { signup } = require("./src/api/components/auth/services/signup")
const { signin } = require("./src/api/components/auth/services/signin")

const { addGroup } = require("./src/api/components/groups/addGroup")
const { deleteGroup } = require("./src/api/components/groups/deleteGroup")
const { getGroupsOfAUser } = require("./src/api/components/groups/getGroupsOfAUser")
const { getAllMembersOfAGroup } = require("./src/api/components/groups/getAllMembersOfAGroup")

const { addUserToAGroup } = require("./src/api/components/users/addUserToAGroup")

const { addExpense } = require("./src/api/components/expenses/addExpense")
const { updateExpense } = require("./src/api/components/expenses/updateExpense")
const { deleteExpense } = require("./src/api/components/expenses/deleteExpense")


//constants declaration
const PORT = 3000;
const APP = express();

//common functions
function randomValueGenerator() {
    return Math.random().toString().substring(2, 8);
}

APP.use(bodyParser.json());

//authentication & authorization

//sign up code
APP.post('/signup', (req, res) => signup(req, res));

//sign in code
APP.post('/signin', (req, res) => signin(req, res));

//validate the otp
APP.post('/validateotp', (req, res) => validateOTP(req, res));

//validating the jwt token
let user_id;
APP.use((req, res, next) => {
    user_id = validateJwtToken(req, res);
    if(user_id != undefined)
        next();
});

//group related apis

//add a group
APP.post('/groups/', (req, res) => addGroup(req, res, user_id))

//delete a group
APP.delete('/groups/', (req, res) => deleteGroup(req, res, user_id))

//get all the groups a user belongs to
APP.get('/groups/', (req, res) => getGroupsOfAUser(req, res, user_id));

//groupmembers related apis

//get all the members of a certain group
APP.get('/groupmembers/:group_id', (req, res) => getAllMembersOfAGroup(req, res));

//add an user to the group
APP.post('/groupmembers', (req, res) => addUserToAGroup(req, res, user_id));

//expenses related apis

//add Expense
APP.post('/expense', (req, res) => addExpense(req, res, user_id));

//listening to the incoming requests
APP.listen(PORT, () => {
    console.log(`APPlication running on ${PORT}`);
});