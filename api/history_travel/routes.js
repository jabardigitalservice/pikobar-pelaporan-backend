module.exports = (server, route) => {
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleRud = require('../users/route_prerequesites').CheckRoleCreate(server)

  return [
    route(
      server, 'POST', '/history-travel/{id_case}',
      'history_travel', CheckRoleRud, 'createHistoryTravel'
    ),route(
      server, 'GET', '/history-travel/{id_case}',
      'history_travel', CheckRoleView, 'getHistoryTravel'
    ),route(
      server, 'PUT', '/history-travel/{id_history_travel}',
      'history_travel', CheckRoleRud, 'updateHistoryTravel'
    ),route(
      server, 'DELETE', '/history-travel/{id_history_travel}',
      'history_travel', CheckRoleRud, 'deleteHistoryTravel'
    )
  ]
}