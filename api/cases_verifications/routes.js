module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const getCasebyId = require('../cases/route_prerequesites').getCasebyId(server)
  const getDetailCase = require('../cases/route_prerequesites').getDetailCase(server)
  const countCaseByDistrict = require('../cases/route_prerequesites').countCaseByDistrict(server)
  const countCasePendingByDistrict = require('../cases/route_prerequesites').countCasePendingByDistrict(server)

  const preFunc = [ getCasebyId, getDetailCase, countCaseByDistrict, countCasePendingByDistrict ]

  const route = (method, path, callback, pre) => {
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} verifications`,
        tags: [ 'api', 'verifications' ],
        pre: pre,
        auth: 'jwt',
      },
      handler: handlers[callback],
    }
  }

  return [
    route('POST', '/cases/verifications', 'SubmitVerifications', []),
    route('PUT', '/cases/{id}/verifications-revise', 'ReviseCaseVerification', preFunc),
  ]
}
