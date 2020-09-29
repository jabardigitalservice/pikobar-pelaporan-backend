module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    {
      method: 'POST',
      path: '/history-travel/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create history-travel',
        tags: ['api', 'history-travel'],
        pre: [ CheckRoleCreate ]
      },
      handler: handlers.createHistoryTravel
    },
    {
      method: 'GET',
      path: '/history-travel/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list history-travel',
        tags: ['api', 'history-travel'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getHistoryTravel
    },
    {
      method: 'PUT',
      path: '/history-travel/{id_history_travel}',
      config: {
        auth: 'jwt',
        description: 'update history-travel',
        tags: ['api', 'history-travel'],
        pre: [ CheckRoleUpdate ],
      },
      handler:  handlers.updateHistoryTravel
    },
    {
      method: 'DELETE',
      path: '/history-travel/{id_history_travel}',
      config: {
        auth: 'jwt',
        description: 'delete history-travel',
        tags: ['api', 'history-travel'],
        pre: [ CheckRoleDelete ],
      },
      handler: handlers.deleteHistoryTravel
    }
  ]
}