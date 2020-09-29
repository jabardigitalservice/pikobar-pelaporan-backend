const fs = require('fs')
const moment = require('moment')
const json2xls = require('json2xls')
const replyHelper = require('../helpers')
const {
  transformedXlsFor
} = require('../../helpers/reports/transformer')

module.exports = (server) => {
  function constructReportResponse(report) {
    let jsonReport = {
      status: 200,
      message: "Success",
      data: report
    }
    // return report
    return jsonReport
  }

  return {
    /**
     * GET /api/reports/daily-report
     * @param {*} request
     * @param {*} reply
     */
    async DailyReport(request, reply){
      server.methods.services.reports.dailyReport(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructReportResponse(result, request)
        ).code(200)
      })
    },
    /**
     * GET /api/reports/daily-report-xls
     * @param {*} request
     * @param {*} reply
     */
    async DailyReportXls(request, reply){
      const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
      server.methods.services.reports.dailyReport(
          request.query,
          request.auth.credentials.user,
          (err, result) => {
            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

            const transformed = transformedXlsFor(result)
            const jsonXls = json2xls(transformed)
            const fileName = `Daily-Report-${fullName}-${moment().format("YYYY-MM-DD-HH-mm")}.xlsx`

            fs.writeFileSync(fileName, jsonXls, 'binary')
            const xlsx = fs.readFileSync(fileName)

            reply(xlsx)
              .header('Content-Disposition', 'attachment filename='+fileName)
            return fs.unlinkSync(fileName)
        })
    },
  }
}
