const schedule = require('node-schedule')
const register = (server, options, next) => {
  schedule.scheduleJob("*/1 * * * *", async function() {
    await require('./lapor_mandiri')(server)
    await require('./labkes_pelaporan')(server)
  })
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register