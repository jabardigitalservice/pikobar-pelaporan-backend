module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const { configRoute} = require("../../helpers/routes")
  return [
    {
      method: 'GET',
      path: '/country',
      config: configRoute("show country lists", "country", CheckRoleView),
      handler: handlers.listCountry(server)
    },
    {
      method: 'GET',
      path: '/menu',
      config: configRoute("show districs in west java areas", "country", CheckRoleView),
      handler: handlers.listMenu(server)
    }
  ]
}