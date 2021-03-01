module.exports = (server, route) => {
  return [
    route(server, 'GET', '/map', 'map', 'mapList'),
    route(server, 'GET', '/map-summary', 'map', 'mapSummary')
  ]
}