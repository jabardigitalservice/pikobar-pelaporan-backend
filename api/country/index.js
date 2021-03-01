const Routes = require('./routes')
const { routeOldNoPre } = require('../../helpers/routes')

const register = (server, options, next) => {
  server.route(Routes(server, routeOldNoPre))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register