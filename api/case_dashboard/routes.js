const { configWithValidation } = require("../../helpers/routes")
const routingDashboard = (handlers, server, validations, role) => {
  return [{
    method: 'GET', path: '/dashboard/v2/summary-case-criteria',
    config: configWithValidation("dashboard", "dashboard", validations.caseDashboard, role
    ),
    handler: handlers.countSectionTop(server),
  }, {
    method: 'GET', path: '/dashboard/v2/summary-case',
    config: configWithValidation("show dashboard revision", "dashboard revision", validations.caseDashboard, role
    ),
    handler: handlers.countSummary(server),
  }, {
    method: 'GET', path: '/dashboard/v2/visualization-case',
    config: configWithValidation("show dashboard case new revision", "dashboard case new revision",
      validations.caseDashboard, role
    ),
    handler: handlers.countVisualization(server),
  }]
}

module.exports = (server) => {
  const handlers = require('./handlers')
  const inputValidations = require('./validations/input')
  const roleView = require('../users/route_prerequesites').CheckRoleView(server)
  return routingDashboard(handlers, server, inputValidations, roleView)
}