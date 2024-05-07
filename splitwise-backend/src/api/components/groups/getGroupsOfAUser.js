const {DB} = require("../common")

const getGroupsOfAUser = (req, res) => {
    console.log(res);
    // res.send("Hello world");
    userGroups = []
    user_id = req.params.user_id
    counter = 0
    console.log(user_id)
    DB.any(`SELECT group_id FROM groupmembers WHERE user_id=${user_id}`)
        .then(function (data) {
            // res.send(data);
            // console.log(data);
            data.forEach((obj) => {
                DB.any(`SELECT group_name, group_id FROM groups where group_id=${obj.group_id}`).
                    then(function (group) {
                        console.log(obj, group);
                        userGroups.push(group[0]);
                        console.log(userGroups);
                        console.log(counter, data.length)
                        ++counter;
                        if (counter == data.length) {
                            console.log("entered")
                            console.log(counter, data.length)
                            res.send(JSON.stringify(userGroups));
                        }
                    });
            })
        })

}

module.exports = {getGroupsOfAUser: getGroupsOfAUser}