module.exports = (server, route) => {
  const service = 'local_transmission'
  const path = '/local-transmission/'
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    route(server, 'POST', `${path}{id_case}`, service, CheckRole, 'createLocalTransmission'),
    route(server, 'GET', `${path}{id_case}`, service, CheckRoleView, 'getLocalTransmission'),
    route(server, 'PUT', `${path}{id_local_transmission}`, service, CheckRole, 'updateLocalTransmission'),
    route(server, 'DELETE', `${path}{id_local_transmission}`, service, CheckRole, 'deleteLocalTransmission')
  ]
}