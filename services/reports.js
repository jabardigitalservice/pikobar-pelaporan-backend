const moment = require('moment')
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')

const {
  aggCaseDailyReport
} = require('../helpers/reports/handler')

async function dailyReport(query, user, callback) {
  try {
    const date = query.date ? new Date(query.date) : undefined
    const dates = {
      aDay: moment(date).format('YYYY-MM-DD'),
      aDueDay: moment(date).add(1,'days').format('YYYY-MM-DD'),
      aWeek: moment(date).subtract(1,'weeks').add(1,'days').format('YYYY-MM-DD'),
      aMonth: moment(date).subtract(1,'months').add(1, 'days').format('YYYY-MM-DD')
    }

    const searching = Check.countByRole(user)

    const aggQueryCase = aggCaseDailyReport(user, query, searching, dates)

    const caseReport = await Case.aggregate(aggQueryCase)

    const result = caseReport.shift()

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.reports.dailyReport',
    method: dailyReport,
  }
]
