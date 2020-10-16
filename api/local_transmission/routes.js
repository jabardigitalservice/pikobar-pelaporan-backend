module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/local-transmission/{id_case}', 'local-transmission',
      handlers.createLocalTransmission(server), roles(server).create
    ),
    route(
      'GET', '/local-transmission/{id_case}', 'local-transmission',
      handlers.getLocalTransmission(server), roles(server).view
    ),
    route(
      'DELETE', '/local-transmission/{id_local_transmission}', 'local-transmission',
      handlers.deleteLocalTransmission(server), roles(server).delete
    ),
    route(
      'PUT', '/local-transmission/{id_local_transmission}', 'local-transmission',
      handlers.updateLocalTransmission(server), roles(server).update
    )
  ]
}