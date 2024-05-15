const { DB, CACHE, TRANSPORTOR } = require("../common")

removeAllUsersFromGroup = async (groupid) => {
    // return DB.any(`DELETE FROM GROUPMEMBERS WHERE group_id=${groupid} returning *`);
    try {
        const r = await DB.any(`DELETE FROM GROUPMEMBERS WHERE group_id=${groupid} returning *`).then((data) => {
            return {
                "count": data.length,
                "status": "success"
            }
        });
        return r;
    } catch (err) {
        return {
            "status": "failure",
            "count": -1,
            "error": err
        }
    }
}

module.exports = { "removeAllUsersFromGroup": removeAllUsersFromGroup }