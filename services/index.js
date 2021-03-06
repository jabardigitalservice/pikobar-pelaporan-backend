const register = (server, options, next) => {
  let services = [].concat(
    require('./users'),
    require('./areas'),
    require('./cases'),
    require('./cases.v2'),
    require('./cases_transfers'),
    require('./cases_verifications'),
    require('./cases_closecontact'),
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
    require('./close_contact'),
    require('./close_contact_histories'),
    require('./case_dashboard'),
    require('./reports'),
    require('./inject'),
    require('./history_travel'),
    require('./public_place'),
    require('./local_transmission'),
    require('./inspection_support'),
    require('./search'),
    require('./cases_other'),
    require('./integration')
  );
  server.method(services)
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register
