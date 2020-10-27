module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const { configRoute} = require("../../helpers/routes")
  return [
    {
      method: 'GET',
      path: '/occupations',
      config: configRoute("show occupation", "occupations", CheckRoleView),
      handler: handlers.ListOccupation(server)
    },
    {
      method: 'GET',
      path: '/occupations/{id}',
      config: configRoute("show detail occupation", "occupations", CheckRoleView),
      handler: handlers.GetOccupationDetail(server)
    }
  ]
}