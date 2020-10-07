const groupingCondition = (grouping, criteria) => {
const { sumActive, sumSick, sumCondition } = require("./func")
  const params = {
    $group: {
      _id: grouping,
      confrimed_active: sumActive(criteria.CONF),
      confrimed_sick_home: sumSick(criteria.CONF, "RUMAH"),
      confrimed_sick_hospital: sumSick(criteria.CONF, ["RS","OTHERS"]),
      confrimed_recovered: sumCondition(criteria.CONF, "1"),
      confrimed_decease: sumCondition(criteria.CONF, "2"),
      probable_active: sumActive(criteria.PROB),
      probable_sick_home: sumSick(criteria.PROB, "RUMAH"),
      probable_sick_hospital: sumSick(criteria.PROB, ["RS","OTHERS"]),
      probable_recovered: sumCondition(criteria.PROB, "1"),
      probable_decease: sumCondition(criteria.PROB, "2"),
      suspect_active: sumActive(criteria.SUS),
      suspect_sick_home: sumSick(criteria.SUS, "RUMAH"),
      suspect_sick_hospital: sumSick(criteria.SUS, ["RS","OTHERS"]),
      suspect_recovered: sumCondition(criteria.SUS, "1"),
      suspect_decease: sumCondition(criteria.SUS, "2"),
      closecontact_active: sumActive(criteria.CLOSE),
      closecontact_sick_home: sumSick(criteria.CLOSE, "RUMAH"),
      closecontact_sick_hospital: sumSick(criteria.CLOSE, ["RS","OTHERS"]),
      closecontact_recovered: sumCondition(criteria.CLOSE, "1"),
      closecontact_decease: sumCondition(criteria.CLOSE, "2")
    }
  }

  return params
}

module.exports = {
  groupingCondition
}