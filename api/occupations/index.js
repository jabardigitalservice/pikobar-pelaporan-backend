const Routes = require('./routes')
const { routeNoPreNew } = require('../../helpers/routes')

const register = (server, options, next) => {
  server.route(Routes(server, routeNoPreNew))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register