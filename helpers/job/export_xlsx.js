const Case = require('../../models/Case')
const { exportByRole } = require('../rolecheck')
const { filterCase } = require('../filter/casefilter')
const { WHERE_GLOBAL } = require('../constant')
const { sqlCaseExport, excellOutput } = require('../filter/exportfilter')
const { searchExport } = require('../../helpers/filter/search')
const { sqlHistoriesExport, excellHistories } = require('../filter/historyfilter')
const { generateExcellPath } = require('../export')

const sameCondition = async (query, user, method, allow, mapingData, name, path) => {
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

    return generateExcellPath(mapingArray, name, fullName, path)
  } catch (error) {
    return error
  }
}

const jobCaseExport = async (query, user) => {
  return await sameCondition(
    query, user, sqlCaseExport, false, excellOutput,
    'Data-Kasus', 'cases'
  )
}

const jobHistoryExport = async (query, user) => {
  return await sameCondition(
    query, user, sqlHistoriesExport, true, excellHistories,
    'Data-Riawayat-Kasus', 'histories'
  )
}

module.exports = {
  jobCaseExport, jobHistoryExport
}