const { constructErrorResponse, replyJson } = require('../helpers')
const { generateExcell } = require('../../helpers/export')

const sameExportCondition = async (server, request, reply, method, titles) => {
  const query = request.query
  const { user } = request.auth.credentials
  const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
  return await server.methods.services.queue[method](
    query, user,
    (err, result) => {
      if (err) return reply(constructErrorResponse(err)).code(422)
      const title = titles
      return generateExcell(result, title, fullName, reply)
  })
}
/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const caseExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'queuCase', `Data-Kasus-`
  )
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const historyExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'queuHistory', `Data-Riwayat-Info-Klinis-`
  )
}

module.exports = {
  caseExport, historyExport
}


const service = 'services.queue'
const Case = require('../models/Case')
const { exportByRole } = require('../helpers/rolecheck')
const { filterCase } = require('../helpers/filter/casefilter')
const {  WHERE_GLOBAL } = require('../helpers/constant')
const { sqlCaseExport, excellOutput } = require('../helpers/filter/exportfilter')
const { searchExport } = require('../helpers/filter/search')
const { sqlHistoriesExport, excellHistories } = require('../helpers/filter/historyfilter')
const { createQueue } = require('../helpers/queue')

const sameConditions = async (condition, method, callback) => {
  try {
    const result = await Case.aggregate(condition)
    callback (null, result.map(cases => method(cases)))
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  try {
    const result = await createQueue()
    const data = {}
    data.jobId = result.id
    data.progress = result.progress
    data.data = result.data
    data.timestamp = result.options.timestamp
    data.status = result.status
    callback (null, data)
  } catch (error) {
    callback(error, null)
  }
  // const filter = await filterCase(user, query)
  // const filterRole = exportByRole({}, user, query)
  // const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  // const search = searchExport(query)
  // params.last_history = { $exists: true, $ne: null }
  // const condition = sqlCaseExport(params, search, query)
  // await sameConditions(condition, excellOutput, callback)
}

const historyExport = async (query, user, callback) => {
  const filter = await filterCase(user, query)
  const filterRole = exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  const search = searchExport(query)
  params.last_history = { $exists: true, $ne: null }
  const where = sqlHistoriesExport(params, search, query)
  await sameCondition(Case, where, excellHistories, callback)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]
