const { DB, CACHE, TRANSPORTOR } = require("../common");

const addExpense = (req, res, user_id) => {
    const groupId = req.body.groupid;
    const split = req.body.split;

    //check if user belongs to the group
    DB.any(`SELECT * FROM groupmembers WHERE group_id=${groupId}`).then((data) => {
        if (user_id in data) {
            let splitMembers = [];
            //TODO: instead of iterating twice, try iterating once
            req.body.split.forEach((entry) => {
                if (entry.user in data)
                    splitMembers.push(entry.user);
                else {
                    res.send({
                        "status": "failure",
                        "message": "User not part of the group",
                        "details": {
                            "userid": entry.user,
                            "groupid": groupId
                        }
                    })
                }
            });
        }

        //considering all the provided users belongs to the group
        let splitDetails = req.body.split;

        DB.any(`INSERT INTO expenses(group_id, expense_name, expense_category_id, description, amount, currency_id, split_type_id, paid_by, created_by) VALUES(${groupId}, '${req.body.expensename}', ${req.body.expensecategoryid}, '${req.body.description}', ${req.body.amount}, ${req.body.currencyid}, ${req.body.splittypeid}, ${req.body.paidby}, ${user_id}) RETURNING *`).then((expense) => {

            splitDetails.forEach((splitMember) => {
                DB.any(`INSERT INTO debts(expense_id, group_member_id, amount) VALUES(${expense[0].expense_id}, ${splitMember.user}, ${splitMember.amount} )`);
            });

            res.send({
                "status": "success",
                "message": "group added successfully",
                "details": {
                    "groupid": req.body.groupid,
                    "expenseid": expense[0].expense_id,
                    "split": req.body.split //this needs to be changed -- do we like query the db again and get details?
                }
            })
        });
    })

    // add try catch blocks to handle any exception/error cases

}
module.exports = { "addExpense": addExpense }