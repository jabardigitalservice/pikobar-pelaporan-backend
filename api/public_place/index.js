const Routes = require('./routes')
const { routeWithPre } = require('../../helpers/routes')

const register = (server, options, next) => {
  const { checkRole } = require('../helpers')
  const roleView = checkRole(server).viewOnly
  const roleCud = checkRole(server).createUpdateDelete
  server.route(Routes(server, routeWithPre, roleView, roleCud))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register