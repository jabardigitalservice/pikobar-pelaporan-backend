const Joi = require('joi');
const { validateOptions, HeadersPayLoad } = require('../../validations');
const _ = require('lodash');

const postPayload = {
    payload: Joi.object().keys({
        unit_level: Joi.number().required().default('null'),
        unit_code: Joi.string().required().allow(null, '').default('null'),
        unit_type: Joi.string().required().default('null'),
        description: Joi.string().required().default('null'),
        name: Joi.string().required().default('null'),
        address: Joi.string().required().default('null'),
        phone_numbers: Joi.array().required(),
        kemendagri_kabupaten_kode: Joi.string().required().allow(null, '').default('null'),
        kemendagri_kecamatan_kode: Joi.string().required().allow(null, '').default('null'),
        kemendagri_kelurahan_kode: Joi.string().required().allow(null, '').default('null'),
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const UnitQueryValidations = {
  query: {
      limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
      offset: Joi.number().integer().default(0).description('number of record to skip'),
      page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
      sort: Joi.string().empty('', 'desc').default('desc').description('sorting by create date'),
      search: Joi.string().empty('', null).default('').description('search data'),
      unit_type: Joi.string().empty('', null).default('').description('unit_type'),
      code_district_code: Joi.string().empty('', null).default('').description('code_district_code'),
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const GetCurrentPayload = {
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  GetCurrentPayload,
  UnitQueryValidations,
  postPayload,
}