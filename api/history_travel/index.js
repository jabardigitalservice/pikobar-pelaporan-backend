const Routes = require('./routes')
const { routeWithPre } = require('../../helpers/routes')

const register = (server, options, next) => {
  const { checkRole } = require('../helpers')
  server.route(Routes(server, routeWithPre, checkRole(server)))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register