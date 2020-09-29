module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    {
      method: 'POST',
      path: '/public-place/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create public-place',
        tags: ['api', 'public-place'],
        pre: [ CheckRoleCreate ]
      },
      handler: handlers.createPublicPlace
    },
    {
      method: 'GET',
      path: '/public-place/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list public-place',
        tags: ['api', 'public-place'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getPublicPlace
    },
    {
      method: 'PUT',
      path: '/public-place/{id_public_place}',
      config: {
        auth: 'jwt',
        description: 'update public-place',
        tags: ['api', 'public-place'],
        pre: [ CheckRoleUpdate ],
      },
      handler:  handlers.updatePublicPlace
    },
    {
      method: 'DELETE',
      path: '/public-place/{id_public_place}',
      config: {
        auth: 'jwt',
        description: 'delete public-place',
        tags: ['api', 'public-place'],
        pre: [ CheckRoleDelete ],
      },
      handler: handlers.deletePublicPlace
    }
  ]
}