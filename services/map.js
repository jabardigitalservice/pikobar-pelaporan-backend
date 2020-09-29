const Case = require('../models/Case')
const maps = require('../helpers/filter/mapfilter')
const { patientStatus } = require('../helpers/custom')

const listMap = async (query, user, callback) => {
  try {
    const aggregateWhere = await maps.aggregateCondition(user, query)
    const result = await Case.aggregate(aggregateWhere)
    result.map(res => {
      res.final_result = patientStatus(res)
    })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name:'services.map.listMap',
    method:listMap
  }
];

