module.exports = (server) =>{
  const handlers = require('./handlers')(server)

  return [
    {
      method: 'GET',
      path: '/reports/daily-report',
      config: {
        auth: 'jwt',
        description: 'Daily report',
        tags: ['api', 'reports.dailyReport'],
      },
      handler: handlers.DailyReport
    },
    {
      method: 'GET',
      path: '/reports/daily-report-xls',
      config: {
        auth: 'jwt',
        description: 'Daily report xls',
        tags: ['api', 'reports.dailyReport'],
      },
      handler: handlers.DailyReportXls
    },
  ]
}
