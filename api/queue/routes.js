module.exports = (server, route) => {
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)

  return [
    route(
      server, 'GET', '/queue/cases',
      'queue', CheckRoleView, 'caseExport'
    ),route(
      server, 'GET', '/queue/histories',
      'queue', CheckRoleView, 'historyExport'
    )
  ]
}