module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'GET', '/occupations', handlers.ListOccupation(server),
      roles(server).view
    ),
    route(
      'GET', '/occupations/{id}',  handlers.GetOccupationDetail(server),
      roles(server).view
    )
  ]
}