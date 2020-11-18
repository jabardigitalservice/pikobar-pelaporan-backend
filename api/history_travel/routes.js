module.exports = (server, route, roleView, roleCud) => {
  return [
    route(
      server, 'POST', '/history-travel/{id_case}',
      'history_travel', roleCud, 'createHistoryTravel'
    ),route(
      server, 'GET', '/history-travel/{id_case}',
      'history_travel', roleView, 'getHistoryTravel'
    ),route(
      server, 'PUT', '/history-travel/{id_history_travel}',
      'history_travel', roleCud, 'updateHistoryTravel'
    ),route(
      server, 'DELETE', '/history-travel/{id_history_travel}',
      'history_travel', roleCud, 'deleteHistoryTravel'
    )
  ]
}