const Routes = require('./routes')
const handlers = require('./handlers')
const { roles, route } = require('../../helpers/routes')
const register = (server, options, next) => {
  server.route(Routes(server, handlers, roles, route))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register