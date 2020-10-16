module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'GET', '/unit',
      handlers.getUnit(server), roles(server).view
    ),route(
      'GET', '/unit/{id}',
      handlers.listUnitById(server), roles(server).view
    ),route(
      'POST', '/unit',
      handlers.createUnit(server), roles(server).create
    ),route(
      'PUT', '/unit/{id}',
      handlers.updateUnit(server), roles(server).update
    ),route(
      'DELETE', '/unit/{id}',
      handlers.deleteUnit(server), roles(server).delete
    )
  ]
}