const register = (server, options, next) => {
  let services = [].concat(
    require('./users'),
    require('./areas'),
    require('./cases'),
    require('./cases_transfers'),
    require('./cases_verifications'),
    require('./histories'),
    require('./occupations'),
    require('./rdt'),
    require('./category'),
    require('./rdt_histories'),
    require('./country'),
    require('./dashboard'),
    require('./notifications'),
    require('./map'),
    require('./unit'),
    require('./case_related'),
    require('./case_revamp'),
    require('./close_contact'),
    require('./close_contact_histories'),
    require('./case_dashboard'),
    require('./reports'),
    require('./inject')
  );
  server.method(services)
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register
