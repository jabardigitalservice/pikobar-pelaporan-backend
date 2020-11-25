const { filterStatus, filterNotGrouping } = require("./globalcondtion")
const { sumFunc, sumBetweenFunc } = require("./func")
const demographicCondition = (grouping, query, criteria) => {
  let query_state = filterStatus(query, criteria)
  const paramsDemographic = {
    $group: {
      _id: grouping,
      wni: sumFunc(query_state,"$nationality", "WNI"),
      wna: sumFunc(query_state, "$nationality", "WNA"),
      male: sumFunc(query_state, "$gender", "L"),
      female: sumFunc(query_state, "$gender", "P"),
      under_five: sumBetweenFunc(query_state, "$age", 0, 6),
      six_nine: sumBetweenFunc(query_state, "$age", 5, 10),
      twenty_twenty_nine: sumBetweenFunc(query_state, "$age", 19, 30),
      thirty_thirty_nine: sumBetweenFunc(query_state, "$age", 29, 40),
      forty_forty_nine: sumBetweenFunc(query_state, "$age", 39, 50),
      fifty_fifty_nine: sumBetweenFunc(query_state, "$age", 49, 60),
      sixty_sixty_nine: sumBetweenFunc(query_state, "$age", 59, 70),
      seventy_seventy_nine: sumBetweenFunc(query_state, "$age", 69, 80),
      greater_eighty: sumBetweenFunc(query_state, "$age", 79, 150)
    }
  }

  return paramsDemographic
}

module.exports = {
  demographicCondition
}
