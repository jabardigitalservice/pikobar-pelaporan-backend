const Joi = require('joi')
const { validateOptions } = require('../../validations')
const _ = require('lodash')
// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------
const caseDashboard = {
  query: {
    address_district_code: Joi.string().empty('', null).default('').description('search data by address_district_code'),
    criteria: Joi.string().empty('', null).default('').description('search data status or criteria'),
    address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa'),
    address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
    start_date: Joi.string().empty('', null).default('').description('search data by date'),
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  caseDashboard,
}