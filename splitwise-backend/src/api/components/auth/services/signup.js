const {DB, CACHE, TRANSPORTOR} = require("../../common")

const signup = (req, res) => {
    console.log(req.body);
    payload = req.body;
    //verify if the req body has both the params and have valid data
    DB.any(`select email_id from users where email_id = '${payload.EmailId}'`).then(
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
                    text: `Your OTP is ${otp}. Please Enter this number and validate yourself in the Application`
                }
                // console.log(TRANSPORTOR)
                TRANSPORTOR.sendMail(mailData, (error, info) => {
                    if (error) {
                        res.status(500).send({ 'status': 'internal server error' })
                        console.log(error)
                    } else {
                        res.status(200).send({ 'status': 'otp sent' })
                        CACHE.set(payload?.EmailId, { ...payload, "OTP": otp }, 600000)
                    }
                })
            } else {
                res.status(201).send({ 'status': 'user already exists' })
            }
        }
    )
    //check DB if the phone number exists or not
    //if not, add the details to redis table 
    //send a otp to the user
    //store the otp in the redis table and increase the counter
    // res.send("some");
}

module.exports = {signup: signup}