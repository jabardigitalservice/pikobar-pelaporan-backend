const service = 'services.queue'
const Case = require('../models/Case')
const { exportByRole } = require('../helpers/rolecheck')
const { filterCase } = require('../helpers/filter/casefilter')
const {  WHERE_GLOBAL } = require('../helpers/constant')
const { sqlCaseExport, excellOutput } = require('../helpers/filter/exportfilter')
const { searchExport } = require('../helpers/filter/search')
const { sqlHistoriesExport, excellHistories } = require('../helpers/filter/historyfilter')

const sameCondition = async (condition, method, callback) => {
  try {
    const result = await Case.aggregate(condition)
    callback (null, result.map(cases => method(cases)))
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  const filter = await filterCase(user, query)
  const filterRole = exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  const search = searchExport(query)
  params.last_history = { $exists: true, $ne: null }
  const condition = sqlCaseExport(params, search, query)
  await sameCondition(condition, excellOutput, callback)
}

const historyExport = async (query, user, callback) => {
  const filter = filterCase(user, query)
  const filterRole = exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  const search = searchExport(query)
  params.last_history = { $exists: true, $ne: null }
  const where = sqlHistoriesExport(params, search, query)
  await sameCondition(where, excellHistories, callback)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]
