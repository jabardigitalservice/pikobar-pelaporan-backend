const mongoose = require('mongoose');
const config = require('../config/config');
const bluebird = require('bluebird');

const register = (server, options, next) => {
  mongoose.Promise = bluebird;
  mongoose.connect(config.database.uri, config.database.options, (err, db) => {
    if (err) console.log(err);

    require('./User')
    require('./Category')
    require('./DistrictCity')
    require('./SubDistrict')
    require('./Village')
    require('./Case')
    require('./CaseTransfer')
    require('./CaseVerification')
    require('./History')
    require('./Occupation')
    require('./RdtHistory')
    require('./LocationTest'),
    require('./Notification'),
    require('./Unit'),
    require('./Lab'),
    require('./CloseContact'),
    require('./CloseContactHistory'),
    require('./Specimen'),
    require('./UserDevice'),

    server.app.db = {
      link: db.db,
      User: db.model('User'),
      Category: db.model('Category'),
      DistrictCity: db.model('Districtcity'),
      SubDistrict: db.model('SubDistrict'),
      Village: db.model('Village'),
      Case: db.model('Case'),
      History: db.model('History'),
      Occupation: db.model('Occupation'),
      RdtHistory: db.model('RdtHistory'),
      LocationTest: db.model('LocationTest'),
      Unit: db.model('Unit'),
      LocationTest: db.model('Lab'),
      CloseContact: db.model('CloseContact'),
      Specimen: db.model('Specimen'),
      UserDevice: db.model('UserDevice'),
    };

    return next();
  });
};

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register;
