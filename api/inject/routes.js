module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const {configRouteComplete} = require('../../helpers/routes')


  return [
    configRouteComplete('GET', '/inject/last-history', null, [ CheckRoleView ], 'Inject',handlers.injectLastHistory(server)),
    configRouteComplete('POST', '/inject/rdt', null, [ CheckRoleCreate ],'Inject' ,handlers.injectRdtTest(server))
  ]
}