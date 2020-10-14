module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'GET', '/occupations', 'occupations',
      handlers.ListOccupation(server), roles(server).view
    ),
    route(
      'GET', '/occupations/{id}', 'occupations',
      handlers.GetOccupationDetail(server), roles(server).view
    )
  ]
}