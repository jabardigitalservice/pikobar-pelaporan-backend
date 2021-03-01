const conf = require('../../config.json')
const { _toString, getStringValueByIndex } = require('../../helper')

// visited_local_area attributes
const getVisitedLocalAreaProvince = (d) => {
  return getStringValueByIndex(d[conf.cell.visited_local_area_province], 0)
}

const getVisitedLocalAreaCity = (d) => {
  return getStringValueByIndex(d[conf.cell.visited_local_area_city], 0)
}

module.exports = {
  getVisitedLocalAreaProvince,
  getVisitedLocalAreaCity,
}
