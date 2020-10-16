module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'GET', '/public-place/{id_case}',
      handlers.getPublicPlace(server), roles(server).view
    ),
    route(
      'POST', '/public-place/{id_case}',
      handlers.createPublicPlace(server), roles(server).create
    ),
    route(
      'PUT', '/public-place/{id_public_place}',
      handlers.updatePublicPlace(server), roles(server).update
    ),
    route(
      'DELETE', '/public-place/{id_public_place}',
      handlers.deletePublicPlace(server), roles(server).delete
    ),
  ]
}