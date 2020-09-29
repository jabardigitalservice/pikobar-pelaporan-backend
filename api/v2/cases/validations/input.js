const consts = require('../../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../../validations')

const RequestPayload = {
  payload: Joi.object().keys({
    interviewers_name: Joi.string().allow('', null),
    interviewers_phone_number: Joi.string().allow('', null),
    interview_date: Joi.date().allow('', null),
    nik: Joi.string().allow('', null),
    nik_note: Joi.string().allow('', null),
    name: Joi.string().allow('', null).required(),
    is_phone_number_exists: Joi.boolean(),
    phone_number: Joi.string().allow('', null),
    phone_number_note: Joi.string().allow('', null),
    birth_date : Joi.date().allow('', null),
    place_of_birth: Joi.string().allow('', null),
    age : Joi.number().required(),
    month : Joi.number().allow('', null),
    gender : Joi.string().allow('', null).valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
    nationality: Joi.string().required(),
    nationality_name: Joi.string().allow('', null),
    is_patient_address_same: Joi.boolean(),
    address_province_code: Joi.string().required(),
    address_province_name: Joi.string().required(),
    address_district_code: Joi.string().required(),
    address_district_name: Joi.string().required(),
    address_subdistrict_code: Joi.string().required(),
    address_subdistrict_name: Joi.string().required(),
    address_village_code: Joi.string().required(),
    address_village_name: Joi.string().required(),
    address_rw: Joi.string().allow('', null),
    address_rt: Joi.string().allow('', null),
    address_street: Joi.string().allow('', null),
  }).unknown(),
  options: validateOptions.options,
  failAction: validateOptions.failAction,
}

module.exports = {
  RequestPayload,
}
