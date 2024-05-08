const { DB, CACHE } = require("../../common")

const validateOTP = (req, res) => {
    // console.log(req.body)
    let payload = req.body
    console.log(payload)
    let cachedObject = CACHE.get(payload?.EmailId)
    console.log(cachedObject)
    if (payload.OTP == cachedObject?.OTP) {
        console.log("OTP matches. Adding the person to the DB")
        //TODO: remove hardcoded password
        //TODO: send cookies?
        DB.any('INSERT INTO USERS(email_id, password, name) VALUES($1, $2, $3)', [cachedObject.EmailId, "password", cachedObject.Name]).then(
            function (data) {
                console.log(data);
                res.status(200).send({ "status": "success" });
            }
        )
    } else {
        res.send({ "status": "failure", "reason": "wrong otp" })
    }
    // res.status(300).send('smtng')
}

module.exports = { validateOTP: validateOTP }