module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRole = require('../users/route_prerequesites').CheckRoleCreate(server)

  return [
    {
      method: 'POST',
      path: '/inspection-support/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRole ]
      },
      handler: handlers.createInspectionSupport(server)
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
      handler:  handlers.getInspectionSupport(server)
    },
    {
      method: 'PUT',
      path: '/inspection-support/{id_inspection_support}',
      config: {
        auth: 'jwt',
        description: 'update inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRole ],
      },
      handler:  handlers.updateInspectionSupport(server)
    },
    {
      method: 'DELETE',
      path: '/inspection-support/{id_inspection_support}',
      config: {
        auth: 'jwt',
        description: 'delete inspection-support',
        tags: ['api', 'inspection-support'],
        pre: [ CheckRole ],
      },
      handler: handlers.deleteInspectionSupport(server)
    }
  ]
}