module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  const apiPath = (method, path, callback, role) => {
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
    apiPath('GET', '/history-travel/{id_case}', 'getHistoryTravel', CheckRoleView),
    apiPath('POST', '/history-travel/{id_case}', 'createHistoryTravel', CheckRoleCreate),
    apiPath('PUT', '/history-travel/{id_history_travel}', 'updateHistoryTravel', CheckRoleUpdate),
    apiPath('DELETE', '/history-travel/{id_history_travel}', 'deleteHistoryTravel', CheckRoleDelete),
  ]
}