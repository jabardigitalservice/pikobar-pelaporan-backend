module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    {
      method: 'POST',
      path: '/local-transmission/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRoleCreate ]
      },
      handler: handlers.createLocalTransmission
    },
    {
      method: 'GET',
      path: '/local-transmission/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getLocalTransmission
    },
    {
      method: 'PUT',
      path: '/local-transmission/{id_local_transmission}',
      config: {
        auth: 'jwt',
        description: 'update local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRoleUpdate ],
      },
      handler:  handlers.updateLocalTransmission
    },
    {
      method: 'DELETE',
      path: '/local-transmission/{id_local_transmission}',
      config: {
        auth: 'jwt',
        description: 'delete local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRoleDelete ],
      },
      handler: handlers.deleteLocalTransmission
    }
  ]
}