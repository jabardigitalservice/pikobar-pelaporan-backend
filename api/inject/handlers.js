const { replyJson } = require('../helpers')

/**
 * GET /api/inject/last-history
 * @param {*} request
 * @param {*} reply
*/
const injectLastHistory = (server) => {
  return async (request, reply) => {
    await server.methods.services.inject.lastHistory(
      request, (err, result) => {
      replyJson(err, result, reply)
    })
  }
}

 /**
 * POST /api/inject/rdt
 * @param {*} request
 * @param {*} reply
 */
const injectRdtTest = (server) => {
  return async (request, reply) => {
    let payload = request.payload
    server.methods.services.inject.injectRdt(
      payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = { injectLastHistory, injectRdtTest }