const conf = require('../../config.json')
const { _toString, _toDateString, getStringValueByIndex, } = require('../../helper')

// traveling_history attributes
// international
const getTravelingVisitedCountry = (d) => {
  return getStringValueByIndex(d[conf.cell.travelling_visited_country], 0)
}

const getTravelingCity = (d) => {
  return _toString(d[conf.cell.travelling_city])
}

// domestic
const getTravelingVisitedDomestic = (d) => {
  return getStringValueByIndex(d[conf.cell.travelling_visited_province], 0)
}

const getTravelingDistrict = (d) => {
  return getStringValueByIndex(d[conf.cell.travelling_district], 0)
}

const getTravelingDate = (d) => {
  return _toDateString(d[conf.cell.travelling_date])
}

const getTravelingArrive = (d) => {
  return _toDateString(d[conf.cell.travelling_arrive])
}

module.exports = {
  getTravelingVisitedCountry,
  getTravelingCity,
  getTravelingVisitedDomestic,
  getTravelingDistrict,
  getTravelingDate,
  getTravelingArrive,
}
