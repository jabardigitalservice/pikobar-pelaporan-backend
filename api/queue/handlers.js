const { constructErrorResponse } = require('../helpers')
const { generateExcell } = require('../../helpers/export')
/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const caseExport = (server) => {
  return async(request, reply) => {
    const query = request.query
    const { user } = request.auth.credentials
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    await server.methods.services.queue.queuCase(
      query, user,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        const title = `Data-Kasus-`
        return generateExcell(result, title, fullName, reply)
      })
  }
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const historyExport = (server) => {
  return async(request, reply) => {
    const query = request.query
    const { user } = request.auth.credentials
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    await server.methods.services.queue.queuHistory(
      query, user,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        const title = `Data-Kasus-`
        return generateExcell(result, title, fullName, reply)
      })
  }
}

module.exports = {
  caseExport, historyExport
}
