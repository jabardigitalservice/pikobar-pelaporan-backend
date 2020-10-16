module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/history-travel/{id_case}',
      handlers.createHistoryTravel(server), roles(server).create
    ),
    route(
      'GET', '/history-travel/{id_case}',
      handlers.getHistoryTravel(server), roles(server).view
    ),
    route(
      'DELETE', '/history-travel/{id_history_travel}',
      handlers.deleteHistoryTravel(server), roles(server).delete
    ),
    route(
      'PUT', '/history-travel/{id_history_travel}',
      handlers.updateHistoryTravel(server), roles(server).update
    )
  ]
}