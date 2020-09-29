module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);

  return [{
      method: 'GET',
      path: '/search',
      config: {
        auth: 'jwt',
        description: 'show list cases by parameter',
        tags: ['api', 'search case'],
        pre: [ CheckRoleView ]
      },
      handler: handlers.getCases
    }
  ]
}