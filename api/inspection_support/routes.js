module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    {
      method: 'POST',
      path: '/inspection-support/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRoleCreate ]
      },
      handler: handlers.createInspectionSupport
    },
    {
      method: 'GET',
      path: '/inspection-support/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getInspectionSupport
    },
    {
      method: 'PUT',
      path: '/inspection-support/{id_inspection_support}',
      config: {
        auth: 'jwt',
        description: 'update inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRoleUpdate ],
      },
      handler:  handlers.updateInspectionSupport
    },
    {
      method: 'DELETE',
      path: '/inspection-support/{id_inspection_support}',
      config: {
        auth: 'jwt',
        description: 'delete inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRoleDelete ],
      },
      handler: handlers.deleteInspectionSupport
    }
  ]
}