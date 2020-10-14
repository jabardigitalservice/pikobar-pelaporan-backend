module.exports = (server, handlers, roles) => {
  const route = (method, path, callback, role) => {
    return {
      method: method,
      path: path,
      config: {
        description: `${method} history-travel`,
        tags: ['api', 'history-travel'],
        pre: [ role ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/history-travel/{id_case}', 'getHistoryTravel', roles(server).view),
    route('POST', '/history-travel/{id_case}', 'createHistoryTravel', roles(server).create),
    route('PUT', '/history-travel/{id_history_travel}', 'updateHistoryTravel', roles(server).update),
    route('DELETE', '/history-travel/{id_history_travel}', 'deleteHistoryTravel', roles(server).delete),
  ]
}