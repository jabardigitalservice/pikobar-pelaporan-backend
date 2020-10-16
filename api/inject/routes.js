module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/inject/rdt', handlers.injectRdtTest(server),
      roles(server).create
    ),
    route(
      'GET', '/inject/last-history', handlers.injectLastHistory(server),
      roles(server).view
    )
  ]
}