const { DB, CACHE, TRANSPORTOR } = require("../common")

addUserToAGroup = (req, res, user_id) => {
    let usersToAdd = req.body.users;
    let groupid = req.body.groupid;
    let response = []
    //TODO: If adding one user fails, what can we do?
    DB.any(`SELECT COUNT(*) FROM groupmembers WHERE group_id = ${groupid} and user_id = ${user_id}`).then((userBelongsToGroup) => {
        let i = 0;
        if(userBelongsToGroup[0].count == 1) {
            usersToAdd.forEach((user) => {
                DB.any(`INSERT INTO groupmembers(group_id, user_id) VALUES(${groupid}, ${user}) WHERE (SELECT COUNT(*) FROM users WHERE user_id = ${user}) = 1 RETURNING *`).then((insertedUser) => {
                            response.push({
                                "status": "success",
                                "details": {
                                    "userid": insertedUser[0].user_id
                                },
                                "message": "successfully added the user to the group"
                            })
                            ++i;
                        }).catch((err) => {
                            ++i
                            response.push({
                                "status": "failure",
                                "details": {
                                    "userid": user,
                                    "error": err
                                },
                                "message": "failed adding the user to the group"
                            });
                            if(i == usersToAdd.length) {
                                res.send({
                                    "groupid": groupid,
                                    "status": response
                                })
                            }
                        })
            });
        } else {
            res.send({
                "status": "failure",
                "message": "The logged in user doesn't belong to the group"
            })
        }
    });
}

module.exports = {"addUserToAGroup": addUserToAGroup}