const Case = require('../../models/Case')
const { exportByRole } = require('../rolecheck')
const { filterCase } = require('../filter/casefilter')
const { WHERE_GLOBAL } = require('../constant')
const { sqlCaseExport, excellOutput } = require('../filter/exportfilter')
const { searchExport } = require('../../helpers/filter/search')
const { sqlHistoriesExport, excellHistories } = require('../filter/historyfilter')
const { generateExcellPath } = require('../export')

const sameCondition = async (query, user, method, allow, mapingData, name, path, jobId) => {
  try {
    // condition filter
    const filter = await filterCase(user, query)
    const filterRole = exportByRole({}, user, query)
    const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
    params.last_history = { $exists: true, $ne: null }

    // condition search
    const search = searchExport(query)

    const condition = method(params, search, query)
    const result = await Case.aggregate(condition).allowDiskUse(allow)
    const mapingArray = result.map(cases => mapingData(cases))

    const fullName = user.fullname.replace(/\s/g, '-')

    return await generateExcellPath(mapingArray, name, fullName, path, jobId)
  } catch (error) {
    return error
  }
}

const jobCaseExport = async (query, user, jobId) => {
  return await sameCondition(
    query, user, sqlCaseExport, false, excellOutput,
    'Data-Pasien', 'cases', jobId
  )
}

const jobHistoryExport = async (query, user, jobId) => {
  return await sameCondition(
    query, user, sqlHistoriesExport, true, excellHistories,
    'Data-Riwayat-Klinis', 'histories', jobId
  )
}

module.exports = {
  jobCaseExport, jobHistoryExport
}