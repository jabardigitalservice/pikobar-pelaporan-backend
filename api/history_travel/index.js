const Routes = require('./routes')
const { routeWithPre } = require('../../helpers/routes')

const register = (server, options, next) => {
  server.route(Routes(server, routeWithPre))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register