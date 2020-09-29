module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)

  return [
    {
      method: 'GET',
      path: '/inject/last-history',
      config: {
        auth: 'jwt',
        description: 'inject last history',
        tags: ['api', 'health for inject'],
        pre: [ CheckRoleView ]
      },
      handler: handlers.injectLastHistory
    },
    {
      method: 'POST',
      path: '/inject/rdt',
      config: {
        auth: 'jwt',
        description: 'inject data rdt from excel or spredsheet',
        tags: ['api', 'rdt'],
        pre: [
          CheckRoleCreate
        ]
      },
      handler: handlers.injectRdtTest
    },
  ]
}