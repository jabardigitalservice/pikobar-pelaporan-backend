const consts = require('../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../validations')

const historyPayload = {
  symptoms: Joi.array(),
  symptoms_date: Joi.date().allow('', null),
  symptoms_other: Joi.string().allow('', null),
  diseases: Joi.array(),
  diseases_other: Joi.string().allow('', null),
  vaccination_influenza_vaccine: Joi.boolean(),
  vaccination_influenza_vaccine_date: Joi.date().allow('', null),
  vaccination_pvc_vaccine: Joi.boolean(),
  vaccination_pvc_vaccine_date: Joi.date().allow('', null),
  test_nasal_swab: Joi.boolean(),
  test_nasal_swab_date: Joi.date().allow('', null),
  test_nasal_swab_result: Joi.string().allow('', null),
  test_throat_swab: Joi.boolean(),
  test_throat_swab_date: Joi.date().allow('', null),
  test_throat_swab_result: Joi.string().allow('', null),
  test_nasopharyngeal_swab: Joi.boolean(),
  test_nasopharyngeal_swab_date: Joi.date().allow('', null),
  test_nasopharyngeal_swab_result: Joi.string().allow('', null),
  test_orofaringeal_swab: Joi.boolean(),
  test_orofaringeal_swab_date: Joi.date().allow('', null),
  test_orofaringeal_swab_result: Joi.string().allow('', null),
  test_serum: Joi.boolean()
}

const RequestPayload = {
  payload: Joi.object().keys({
      interviewer_name: Joi.string().allow('', null),
      contact_tracing_date: Joi.date().allow('', null),
      is_nik_exists: Joi.boolean(),
      nik: Joi.string().allow('', null),
      nik_note: Joi.string().allow('', null),
      name: Joi.string().allow('', null).required(),
      is_phone_number_exists: Joi.boolean(),
      phone_number: Joi.string().allow('', null),
      phone_number_note: Joi.string().allow('', null),
      birth_date : Joi.date().allow('', null),
      age : Joi.number().required(),
      month : Joi.number().required(),
      gender : Joi.string().allow('', null).valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
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
      relationship: Joi.string().required(),
      relationship_other: Joi.string().allow('', null),
      activity: Joi.array().allow('', null),
      activity_other: Joi.string().allow('', null),
      emergency_contact_name: Joi.string().required(),
      emergency_contact_phone: Joi.string().required(),
      emergency_contact_relationship: Joi.string().allow('', null),
      travel_is_went_abroad: Joi.boolean(),
      travel_visited_country: Joi.string().allow('', null),
      travel_country_depart_date: Joi.date().allow('', null),
      travel_country_return_date: Joi.date().allow('', null),
      travel_is_went_other_city : Joi.boolean(),
      travel_visited_city: Joi.string().allow('', null),
      travel_city_depart_date: Joi.date().allow('', null),
      travel_city_return_date: Joi.date().allow('', null),
      travel_occupation: Joi.string().required(),
      travel_address_office: Joi.string().allow('', null),
      travel_transportations: Joi.array().required(),
      contact_type: Joi.number().allow('', null),
      contact_place: Joi.number().allow('', null),
      contact_date: Joi.date().required(),
      start_contact_date: Joi.date().allow('', null),
      end_contact_date: Joi.date().allow('', null),
      contact_durations: Joi.number().allow('', null),
      home_contact_date: Joi.date().allow('', null),
      home_contact_days: Joi.number().allow('', null),
      home_contact_activities: Joi.array(),
      officer_is_contact: Joi.boolean(),
      officer_protection_tools: Joi.array(),
      is_reported: Joi.boolean(),
      latest_history: historyPayload
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const QueryValidations = {
  query: {
      limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
      offset: Joi.number().integer().default(0).description('number of record to skip'),
      page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
      sort: Joi.string().empty('', 'desc').default('desc').description('sorting by create date'),
      search: Joi.string().empty('', null).default('').description('search data'),
      is_reported: Joi.boolean().description('is_reported'),
      address_district_code: Joi.string().empty('', null).default('').description('search data by Case name'),
      address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
      address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa')
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  RequestPayload,
  QueryValidations
}