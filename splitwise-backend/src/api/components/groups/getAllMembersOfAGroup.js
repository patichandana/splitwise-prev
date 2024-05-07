const {DB} = require("../common")

const getAllMembersOfAGroup = (req, res) => {
    group_id = req.params.group_id;
    groupDetails = []
    console.log(group_id)
    counter = 0;
    DB.any(`SELECT user_id from groupmembers where group_id=${group_id}`).
        then(function (data) {
            data.forEach((obj) => {
                DB.any(`SELECT user_id, name from users where user_id=${obj.user_id}`).
                    then(function (user) {
                        // console.log(user);
                        groupDetails.push(user[0]);
                        counter++;
                        if (counter == data.length) {
                            res.send(JSON.stringify(groupDetails))
                        }
                    })
            })
        })

}

module.exports = {getAllMembersOfAGroup: getAllMembersOfAGroup}