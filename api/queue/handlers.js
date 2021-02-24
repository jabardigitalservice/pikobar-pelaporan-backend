const { constructErrorResponse } = require('../helpers')
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
