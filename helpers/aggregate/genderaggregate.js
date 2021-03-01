const { matchWhere } = require("./globalcondtion")
const { grupFunc  } = require("./func")
const groupCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const paramsGender = [
    grupFunc(matchs, "$gender")
  ]

  const paramsNationality = [
    grupFunc(matchs, "$nationality")
  ]

  return {
    "gender": paramsGender,
    "nationality": paramsNationality
  }
}

module.exports = {
  groupCondition
}