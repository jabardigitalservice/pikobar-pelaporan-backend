const groupingMap = (grouping, query, criteria) => {
  const { sumActive, sumCondition } = require("./func")
  const params = {
    $group: {
      _id: grouping,
      confirm_active: sumActive(criteria.CONF),
      confirm_done: sumCondition(criteria.CONF, "1"),
      confirm_died: sumCondition(criteria.CONF, "2"),
      probable_active: sumActive(criteria.PROB),
      probable_done: sumCondition(criteria.PROB, "1"),
      probable_discarded: sumCondition(criteria.PROB, "3"),
      suspect_active: sumActive(criteria.SUS),
      suspect_discarded: sumCondition(criteria.SUS, "3"),
      closecontact_active: sumActive(criteria.CLOSE),
      closecontact_discarded: sumCondition(criteria.CLOSE, "3"),
      longitude: { $first: '$geolocation.longitude' },
      latitude: { $first: '$geolocation.latitude' },
    }
  }

  return params
}

module.exports = {
  groupingMap
}