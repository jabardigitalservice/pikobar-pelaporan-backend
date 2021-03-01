module.exports = (server, route) => {
  return [
    route(server, 'GET', '/occupations', 'occupations', 'ListOccupation'),
    route(server, 'GET', '/occupations/{id}', 'occupations', 'GetOccupationDetail')
  ]
}