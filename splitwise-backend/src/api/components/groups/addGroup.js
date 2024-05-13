const { DB, CACHE, TRANSPORTOR } = require("../common")
// const { getCurrentTimeStamp } = require("../../../utils");
const jwt = require("jsonwebtoken")

require('dotenv').config();

addGroup = (req, res, user_id) => {
    const groupName = req.body.groupname;
    const groupType = req.body.grouptype;
    // const time = getCurrentTimeStamp();
    //verify if the token is not tampered

    DB.any(`insert into groups(group_name, type_id, created_by) values('${groupName}',${groupType}, ${user_id}) returning *`).then((data) => {
        console.log(data);
        if (data.length > 0) {
            res.send({
                "status": "success",
                "group": {
                    "groupid": data[0].group_id,
                    "groupname": data[0].group_name,
                    "grouptype": data[0].group_type,
                    "createdate": data[0].created_at
                },
                "message": "Group successfully added"
            })
        } else {
            res.send({
                "status": "failure",
                "message": "failed adding group. Please try again."
            })
        }
    })
}

module.exports = { "addGroup": addGroup }