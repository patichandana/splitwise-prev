const { DB, CACHE, TRANSPORTOR } = require("../../common")
const jwt = require("jsonwebtoken")
const base64url = require('base64url');

require('dotenv').config();

const signin = (req, res) => {
    console.log(req.body)
    let emailId = req.body.emailId;
    let password = req.body.password;
    DB.any(`select * from users where email_id = '${emailId}' and password = '${password}'`).then((data) => {
        if (data.length > 0) {
            const payload = { "email_id": emailId }
            const token = jwt.sign( payload, process.env.AUTH_SECRET, { expiresIn: '1d' });
            res.setHeader('Authorization', `Bearer ${token}`)
            res.send({ "exists": true, "status": "success" });
        } else {
            res.send({ "exists": false, "status": "no user found" })
        }
    })
    //emailid, password as inputs
    //return some jwt token > which contains the email id and expiry time and a message digest signed with a secret key?
}

module.exports = { signin: signin }