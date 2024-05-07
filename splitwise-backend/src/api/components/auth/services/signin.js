const {DB, CACHE, TRANSPORTOR} = require("../../common")

const signin = (req, res) => {
    console.log(req.body)
}

module.exports = {signin: signin}