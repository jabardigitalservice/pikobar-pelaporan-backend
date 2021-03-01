const conf = require('../../config.json')
const { refPlaceCategories } = require('../../reference')
const { _toString, _toDateString, findReference } = require('../../helper')

// visited_public_place attributes
const getPublicPlaceCategory = (d) => {
  return findReference(refPlaceCategories, d[conf.cell.public_place_category])
}

const getPublicPlaceName = (d) => {
  return _toString(d[conf.cell.public_place_name])
}

const getPublicPlaceAddress = (d) => {
  return _toString(d[conf.cell.public_place_address])
}

const getPublicPlaceDateVisited = (d) => {
  return _toDateString(d[conf.cell.public_place_date_visited])
}

const getPublicPlaceDurationVisited = (d) => {
  return _toString(d[conf.cell.public_place_duration_visited])
}

module.exports = {
  getPublicPlaceCategory,
  getPublicPlaceName,
  getPublicPlaceAddress,
  getPublicPlaceDateVisited,
  getPublicPlaceDurationVisited,
}
