const Routes = require('./routes');

const register = (server, options, next) => {
  server.route(Routes(server));
  return next();
}

register.attributes = {
  pkg: require('./package.json'),
}

module.exports = register;
