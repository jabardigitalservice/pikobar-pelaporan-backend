const conf = require('../../config.json')
const { refInspectionTypes, refSpecimenTypes } = require('../../reference')
const { _toString, _toDateString, _toUnsignedInt, findReference } = require('../../helper')
// part of inspection support
const getInspectionType = (d) => {
  return findReference(refInspectionTypes, d[conf.cell.inspection_type])
}

const getSpecienType = (d) => {
  return findReference(refSpecimenTypes, d[conf.cell.specimens_type])
}

const getInspectionDate = (d) => {
  return _toDateString(d[conf.cell.inspection_date])
}

const getInspectionLocation = (d) => {
  return _toString(d[conf.cell.inspection_location])
}

const getSpecimenTo = (d) => {
  return _toUnsignedInt(d[conf.cell.get_specimens_to])
}

const getInspectionResult = (d) => {
  return _toString(d[conf.cell.inspection_result])
}

module.exports = {
  getInspectionType,
  getSpecienType,
  getInspectionDate,
  getInspectionLocation,
  getSpecimenTo,
  getInspectionResult,
}
