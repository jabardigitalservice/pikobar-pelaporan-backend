const moment = require('moment')
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')
const { filterCase } = require('../helpers/filter/casefilter')
const { setKeyReport } = require('../helpers/reports/filter')
const {
  aggCaseDailyReport
} = require('../helpers/reports/handler')
const { clientConfig } = require('../config/redis')
const formatDate = 'YYYY-MM-DD'

async function dailyReport(query, user, callback) {
  const date = query.date ? new Date(query.date) : undefined
  const dates = {
    aDay: moment(date).format(formatDate), aDueDay: moment(date).add(1, 'days').format(formatDate),
    aWeek: moment(date).subtract(1, 'weeks').add(1, 'days').format(formatDate),
    aMonth: moment(date).subtract(1, 'months').add(1, 'days').format(formatDate)
  }
  const searching = { ...Check.countByRole(user), ...await filterCase(user, query) }
  const aggQueryCase = aggCaseDailyReport(searching, dates)
  const expireTime = 15 * 60 * 1000 // 15 minute expire
  const key = setKeyReport(query, user)
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        console.info(`redis source ${key}`)
        callback(null, JSON.parse(result))
      }else{
        const caseReport = await Case.aggregate(aggQueryCase)
        const res = caseReport.shift()
        clientConfig.setex(key, expireTime, JSON.stringify(res)) // set redis key
        console.info(`api source ${key}`)
        callback(null, res)
      }
    })
  } catch (error) { callback(error, null) }
}

module.exports = [
  {
    name: 'services.reports.dailyReport',
    method: dailyReport,
  }
]