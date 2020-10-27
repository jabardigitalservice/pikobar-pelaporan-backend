module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const { configRoute} = require("../../helpers/routes")
  return [
    {
      method: 'GET',
      path: '/category-target',
      config: configRoute("show target by category", "category-target", CheckRoleView),
      handler: handlers.getListTarget(server)
    },
    {
      method: 'GET',
      path: '/category-target/{id}',
      config: configRoute("show target by category", "category-target", CheckRoleView),
      handler: handlers.getListTargetByCategory(server)
    },
    {
      method: 'GET',
      path: '/type-specimens',
      config: configRoute("type Specimens", "category-target", CheckRoleView),
      handler: handlers.getTypeSpeciment(server)
    },
    {
      method: 'POST',
      path: '/category-target',
      config: configRoute("create category", "category-target", CheckRoleCreate),
      handler: handlers.createCategory(server)
    }
  ]
}