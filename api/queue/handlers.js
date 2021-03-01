const { replyJson } = require('../helpers')

const sameExportCondition = async (server, request, reply, method) => {
  const query = request.query
  const { user } = request.auth.credentials
  return await server.methods.services.queue[method](
    query, user, reply,
    (err, result) => replyJson(err, result, reply)
  )
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
    server, request, reply, 'queuCase',
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
    server, request, reply, 'queuHistory',
  )
}

module.exports = {
  caseExport, historyExport
}
