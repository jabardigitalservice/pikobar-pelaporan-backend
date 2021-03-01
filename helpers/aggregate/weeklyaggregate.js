const { matchWhere } = require("./globalcondtion")
const { dateGrouping } = require("./globalcondtion")
const { sumWeeklyFunc } = require("./func")
const weeklyCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const dateGroup = dateGrouping()
  const paramsWeekly = [matchs, {
    $project: { "weekly": {
        $concat: [
          sumWeeklyFunc(dateGroup.date_one, "date_one"),
          sumWeeklyFunc(dateGroup.date_two, "date_two"),
          sumWeeklyFunc(dateGroup.date_tree, "date_tree"),
          sumWeeklyFunc(dateGroup.date_four, "date_four"),
          sumWeeklyFunc(dateGroup.date_five, "date_five"),
          sumWeeklyFunc(dateGroup.date_six, "date_six"),
          sumWeeklyFunc(dateGroup.date_seven, "date_seven")
        ]
      }
    }
  },
    { $group: { "_id": "$weekly", count: { $sum: 1 } } }
  ]
  return paramsWeekly
}

module.exports = {
  weeklyCondition
}