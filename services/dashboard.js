const Rdt = require('../models/Rdt')
const Sql = require('../helpers/sectionnumber')
const { CRITERIA } = require('../helpers/constant')
const { conditionGender } = require('../helpers/aggregate/rdtgender')
const { conditionSummary } = require('../helpers/aggregate/rdtaggregate')
const { conditionAge } = require('../helpers/aggregate/rdtage')
const { conditionLocation } = require('../helpers/aggregate/rdtlocation')
const servicesInput = 'services.dashboard.summaryInputTest'
const servicesResult = 'services.dashboard.summaryTestResult'
const servicesLocation = 'services.dashboard.summaryTestResultLocation'
const servicesGender = 'services.dashboard.summaryGender'
const servicesAge = 'services.dashboard.summaryAge'

const summaryInputTest = async (query, user, callback) => {
  try {
    const querySummary = Sql.summaryInputTest(user, query)
    const result = await Rdt.aggregate(querySummary)
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const summaryTestResult = async (query, user, callback) => {
  try {
    const queryParam = query
    const condition = await conditionSummary(queryParam, user)
    const resultCount = await Rdt.aggregate(condition)
    verificationData(resultCount, callback)
  } catch (e) {
    callback(e, null)
  }
}

const loopFilter = (i) => {
  if (i._id === CRITERIA.CLOSE){
    i._id = CRITERIA.CLOSE_ID
  }
  if (i._id === CRITERIA.SUS){
    i._id = CRITERIA.SUS_ID
  }
  if (i._id === CRITERIA.PROB){
    i._id = CRITERIA.PROB_ID
  }
  if (i._id === CRITERIA.CONF){
    i._id = CRITERIA.CONF_ID
  }
  return i
}

const summaryTestResultLocation = async (query, user, callback) => {
  try {
    const condition = await conditionLocation(query, user)
    const resultCount = await Rdt.aggregate(condition)
    const manipulateData = resultCount.map((row) => {
      row.targets.map((i) => {
        loopFilter(i)
      })
      return row
    })
    verificationData(manipulateData, callback)
  } catch (e) {
    callback(e, null)
  }
}

const summaryGender = async (query, user, callback) => {
  try {
    const condition = await conditionGender(query, user)
    const resultCount = await Rdt.aggregate(condition)
    verificationData(resultCount, callback)
  } catch (e) {
    callback(e, null)
  }
}

const summaryAge = async (query, user, callback) => {
  try {
    const condition = await conditionAge(query, user)
    const result = await Rdt.aggregate(condition)
    if (result) {
      return callback(null, result)
    } else {
      return callback(null, 'something wrong')
    }
  } catch (e) {
    callback(e, null)
  }
}

const verificationData = (result, callback) => {
  if (result) {
    return callback(null, result)
  } else {
    return callback(null, 'something wrong')
  }
}

module.exports = [
  { name: servicesInput ,method: summaryInputTest },
  { name: servicesResult, method: summaryTestResult},
  { name: servicesLocation, method: summaryTestResultLocation},
  { name: servicesGender, method: summaryGender },
  { name: servicesAge, method: summaryAge },
]