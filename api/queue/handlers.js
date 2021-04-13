const { replyJson } = require('../helpers')

const sameExportCondition = (server, request, reply, method) => {
  const query = request.query
  const { user } = request.auth.credentials
  return server.methods.services.queue[method](
    query, user,
    (err, result) => replyJson(err, result, reply)
  )
}

const sameBodyCondition = (server, request, reply, method) => {
  const { params, payload } = request
  const { user } = request.auth.credentials
  return server.methods.services.queue[method](
    params, payload, user,
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

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const listExport = (server) => {
  return async(request, reply) => await sameExportCondition(
    server, request, reply, 'listExport',
  )
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const resendFile = (server) => {
  return async(request, reply) => await sameBodyCondition(server, request, reply, 'resendFile')
}

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
// const cancelJob = (server) => {
//   return async(request, reply) => await sameBodyCondition(server, request, reply, 'cancelJob')
// }

/**
  *
  *
  * @param {*} server
  * @param {*} request
  * @param {*} reply
*/
const historyEmail = (server) => {
  return async(request, reply) => await sameBodyCondition(server, request, reply, 'historyEmail')
}

module.exports = {
  caseExport, historyExport, listExport, resendFile, historyEmail
}