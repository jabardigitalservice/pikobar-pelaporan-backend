module.exports = (server, route) => {
  return [
    route(server, 'GET', '/country', 'country', 'listCountry'),
    route(server, 'GET', '/menu', 'country', 'listMenu'),
  ]
}