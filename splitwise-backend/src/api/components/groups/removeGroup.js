const { DB, CACHE, TRANSPORTOR } = require("../common")
const { removeAllUsersFromGroup } = require("../users/removeAllUsersFromGroup");

const removeGroup = async (req, res, user_id) => {
    //check if group is undefined and a number
    //if yes, proceed to delete
    try {
        const groupId = req.body.groupid;
        if (groupId) {
            //check if it's the same user who created the group
            //need to add code to remove all the users of the group and then remove the group
            const removedUsersData = removeAllUsersFromGroup(groupId);
            if (removedUsersData.count == -1) {
                res.send({
                    "status": "failure",
                    "message": "failed to remove users in the group"
                })
                return;
            } else {
                DB.any(`DELETE FROM GROUPS WHERE group_id = ${groupId} and created_by = ${user_id} returning *`).then((data) => {
                    console.log(data)
                    if (data.length == 0) {
                        res.send({
                            "status": "failure",
                            "message": "No group found matching the provided group id and user id"
                        })
                    } else {
                        if (data.length == 1) {
                            res.send({
                                "status": "success",
                                "details": {
                                    "groupid": data[0].group_id,
                                    "groupname": data[0].group_name
                                }
                            })
                        } else {
                            //this case shouldn't happen at all
                            res.send({
                                "status": "Unintentional data deleted",
                                "message": "Multiple groups seems to be deleted. Please contact developers?"
                            })
                        }
                    }
                });
            }
        }
    } catch (err) {
        res.send({
            "status": "failure",
            "message": "Enter a valid group id",
            "error": err
        })
    }
}

module.exports = { "removeGroup": removeGroup }