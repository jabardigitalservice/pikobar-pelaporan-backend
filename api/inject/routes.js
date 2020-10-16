module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/inject/rdt', 'inject data rdt from excel or spredsheet',
      handlers.injectRdtTest(server), roles(server).create
    ),
    route(
      'GET', '/inject/last-history', 'health for inject last history',
      handlers.injectLastHistory(server), roles(server).view
    )
  ]
}