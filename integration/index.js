const register = (server, options, next) => {
    require('./lapor_mandiri')(server)
    require('./labkes_pelaporan')(server)
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register