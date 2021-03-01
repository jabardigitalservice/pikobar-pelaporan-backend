const Routes = require('./routes')
const RoutesExplode = require('./routes_explode')

const register = (server, options, next) => {
  server.route(Routes(server))
  server.route(RoutesExplode(server))
  return next();
}

register.attributes = {
  pkg: require('./package.json'),
}

module.exports = register;