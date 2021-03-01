const { sumFunc } = require("./func")
const recapCondition = (grouping, criteria) => {
  const params = {
    $group: {
      _id: grouping,
      confirmed: sumFunc({},"$status", criteria.CONF),
      probable: sumFunc({},"$status", criteria.PROB),
      suspect: sumFunc({},"$status", criteria.SUS),
      closecontact: sumFunc({},"$status", criteria.CLOSE)
    }
  }
  return params
}

module.exports = { recapCondition }