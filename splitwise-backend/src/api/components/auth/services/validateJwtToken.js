const jwt = require('jsonwebtoken');
require('dotenv').config();

validateJwtToken = (req, res) => {
    const token = req.get('Authorization').split(" ")[1];
    let user_id;
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
        if (decoded == undefined) {
            res.send({"status": "failure", "message": "Authentication failed. Please try logging in again"});
            user_id = undefined;
        } else {
            user_id = decoded.userId;
        }
    })
    return user_id;
}

module.exports = { "validateJwtToken": validateJwtToken }