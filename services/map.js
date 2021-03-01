const Case = require('../models/Case')
const { aggregateCondition } = require('../helpers/aggregate/mapaggregate')
const { patientStatus } = require('../helpers/custom')

const listMap = async (query, user, callback) => {
  try {
    const aggregateWhere = await aggregateCondition(user, query)
    const result = await Case.aggregate(aggregateWhere)
    result.map(res => {
      res.final_result = patientStatus(res.final_result)
    })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}


const listSummary = async (query, user, callback) => {
  try {
    const { summaryMap } = require('../helpers/aggregate/mapsummaryaggregate')
    const aggregateWhere = await summaryMap(user, query)
    const result = await Case.aggregate(aggregateWhere)
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}


module.exports = [
  {
    name:'services.map.listMap',
    method:listMap
  },{
    name:'services.map.listSummary',
    method:listSummary
  }
];

