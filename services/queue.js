const service = 'services.queue'
const Case = require('../models/Case')
const { exportByRole } = require('../helpers/rolecheck')
const { filterCase } = require('../helpers/filter/casefilter')
const {  WHERE_GLOBAL } = require('../helpers/constant')
const { sqlCaseExport, excellOutput } = require('../helpers/filter/exportfilter')

const caseExport = async (query, user, callback) => {
  const filter = await filterCase(user, query)
  const filterRole = exportByRole({}, user, query)
  const params = { ...filter, ...filterRole, ...WHERE_GLOBAL }
  let search
  if(query.search){
    let search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];
    search = search_params
  } else {
    search = {}
  }
  params.last_history = { $exists: true, $ne: null }
  const condition = sqlCaseExport(params, search, query)
  try {
    const resultExport = await Case.aggregate(condition).allowDiskUse(true)
    callback (null, resultExport.map(cases => excellOutput(cases)))
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  { name: `${service}.queuCase`, method: queuCase },
  { name: `${service}.queuHistory`, method: queuHistory },
]
