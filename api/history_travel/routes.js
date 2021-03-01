module.exports = (server, route) => {
  const service = 'history_travel'
  const pathCase = '/history-travel/{id_case}'
  const pathHistory = '/history-travel/{id_history_travel}'
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    route(server, 'POST', pathCase, service, CheckRole, 'createHistoryTravel'),
    route(server, 'GET', pathCase, service, CheckRoleView, 'getHistoryTravel'),
    route(server, 'PUT', pathHistory, service, CheckRole, 'updateHistoryTravel'),
    route(server, 'DELETE', pathHistory, service, CheckRole, 'deleteHistoryTravel')
  ]
}