const { DB, CACHE, TRANSPORTOR } = require("../common")

isUserPartOfTheGroup = (req, res, user_id) => {
    let groupid = req.body.groupid;
    //add code to check if user belongs to the group
}

module.exports = {"isUserPartOfTheGroup": this.isUserPartOfTheGroup}