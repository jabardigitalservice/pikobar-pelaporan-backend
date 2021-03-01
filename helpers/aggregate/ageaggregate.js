const { matchWhere } = require("./globalcondtion")
const ageCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const paramsAge = [
    matchs,
    {
      $project: {
        "range": {
          $concat: [
            { $cond: [{ $and: [{ $gt: ["$age", 0] }, { $lt: ["$age", 5] }] }, "under_five", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 6] }, { $lt: ["$age", 20] }] }, "six_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 20] }, { $lt: ["$age", 30] }] }, "twenty_twenty_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 30] }, { $lt: ["$age", 40] }] }, "thirty_thirty_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 40] }, { $lt: ["$age", 50] }] }, "forty_forty_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 50] }, { $lt: ["$age", 60] }] }, "fifty_fifty_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 60] }, { $lt: ["$age", 70] }] }, "sixty_sixty_nine", ""] },
            { $cond: [{ $and: [{ $gte: ["$age", 70] }, { $lt: ["$age", 80] }] }, "seventy_seventy_nine", ""] },
            { $cond: [{ $gte: ["$age", 80] }, "grather_eighty", ""] }
          ]
        }
      }
    },
    {
      $group: { "_id": "$range", count: { $sum: 1 }}
    }
  ]
  return paramsAge
}

module.exports = { ageCondition }