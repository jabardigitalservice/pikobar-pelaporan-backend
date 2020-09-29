const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')

const CaseTransferPayload = Joi.object().keys({
    transfer_to_unit_id: Joi.string().required(),
    transfer_to_unit_name: Joi.string().required(),
    transfer_comment: Joi.string().allow('', null).optional().default(null),
})

const CaseTransferActionPayload = Joi.object().keys({
    transfer_comment: Joi.string().allow('', null).optional().default(null),
})

const CaseParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}

const TransferActionParamsValidations = {
    params: {
        id: Joi.string().required(),
        transferId: Joi.string().required(),
        action: Joi.string().valid('approve','decline','abort').required(),
    }
}

const TransferCaseListParamValidations = {
    params: {
        type: Joi.string().valid('in','out').required(),
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

const historyPayload = {
    status: Joi.string().required(),
    stage: Joi.string().required(),
    final_result: Joi.string().allow('', null).empty(['', null]).default(null),
    diagnosis: Joi.array().allow('', null).empty(['', null]).default([]),
    diagnosis_other: Joi.string().allow('', null).empty(['', null]).default(null),
    diseases: Joi.array().allow('', null).empty(['', null]).default([]),
    diseases_other: Joi.string().allow('', null).empty(['', null]).default(null),
    last_changed: Joi.date().allow('', null).empty(['', null]).default(null),
    is_went_abroad: Joi.boolean().allow('', null).empty(['', null]).default(false),
    visited_country: Joi.string().allow('', null).empty(['', null]).default(null),
    return_date: Joi.date().allow('', null).empty(['', null]).default(null),
    is_went_other_city: Joi.boolean().allow('', null).empty(['', null]).default(false),
    visited_city: Joi.string().allow('', null).empty(['', null]).default(null),
    is_contact_with_positive: Joi.boolean().allow('', null).empty(['', null]).default(false),
    history_notes: Joi.string().allow('', null).empty(['', null]).default(null),
    is_sample_taken: Joi.boolean().allow('', null).empty(['', null]).default(false),
    report_source: Joi.string().allow('', null).empty(['', null]).default(null),
    first_symptom_date: Joi.date().allow('', null).empty(['', null]).default(null),
    other_notes: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_type: Joi.string().required(),
    current_hospital_id: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_address: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_village_code: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_subdistrict_code: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_district_code: Joi.string().allow('', null).empty(['', null]).default(null),
    current_location_province_code: Joi.string().allow('', null).empty(['', null]).default("32"),
    diagnosis_ards: Joi.number().allow('', null).empty(['', null]).default(0),
    diagnosis_covid: Joi.number().allow('', null).empty(['', null]).default(0),
    diagnosis_pneumonia: Joi.number().allow('', null).empty(['', null]).default(0),
    other_diagnosis: Joi.string().allow('', null).empty(['', null]).default(0),
    // serum_check: Joi.boolean().allow('', null).empty(['', null]).default(false),
    // sputum_check: Joi.boolean().allow('', null).empty(['', null]).default(false),
    // swab_check: Joi.boolean().allow('', null).empty(['', null]).default(false),
    physical_check_temperature: Joi.number().allow('', null).empty(['', null]).default(0),
    physical_check_blood_pressure: Joi.number().allow('', null).empty(['', null]).default(0),
    physical_check_pulse: Joi.number().allow('', null).empty(['', null]).default(0),
    physical_check_respiration: Joi.number().allow('', null).empty(['', null]).default(0),
    physical_check_height: Joi.number().allow('', null).empty(['', null]).default(0),
    physical_check_weight: Joi.number().allow('', null).empty(['', null]).default(0),
}

const RequestPayload = {
    payload: Joi.object().keys({
        id_case_national: Joi.string().allow('', null).default(null),
        is_nik_exists: Joi.boolean().allow('', null).empty(['', null]).default(false),
        nik: Joi.string().allow('', null).default(null),
        note_nik: Joi.string().allow('', null).default(null),
        id_case_related: Joi.string().allow('', null).default(null),
        name_case_related: Joi.string().allow('', null).default(null),
        name: Joi.required(),
        name_parents: Joi.string().allow('', null).default(null),
        interviewers_name: Joi.string().allow('', null).default(null),
        interviewers_phone_number: Joi.string().allow('', null).default(null),
        interview_date: Joi.string().allow('', null).default(null),
        place_of_birth: Joi.string().allow('', null).default(null),
        birth_date: Joi.date().allow('', null).empty(['', null]).default(null),
        age: Joi.number().required(),
        month: Joi.number().allow('', null).empty(['', null]).default(0),
        gender: Joi.required(),
        address_street: Joi.string().allow('', null).default(null),
        address_village_code: Joi.string().required(),
        address_village_name: Joi.string().required(),
        address_subdistrict_code: Joi.string().required(),
        address_subdistrict_name: Joi.string().required(),
        address_district_code: Joi.string().required(),
        address_district_name: Joi.string().required(),
        address_province_code: Joi.string().allow('', null).empty(['', null]).default("32"),
        address_province_name: Joi.string().allow('', null).empty(['', null]).default("Jawa Barat"),
        rt: Joi.number().allow('', null).empty(['', null]).default(0),
        rw: Joi.number().allow('', null).empty(['', null]).default(0),
        office_address: Joi.string().allow('', null).default(null),
        is_phone_number_exists: Joi.boolean().allow('', null).empty(['', null]).default(false),
        phone_number: Joi.string().allow('', null).default(null),
        note_phone_number: Joi.string().allow('', null).default(null),
        nationality: Joi.string().required(),
        nationality_name: Joi.string().allow('', null).default(null),
        occupation: Joi.string().allow('', null).default(null),
        final_result: Joi.string().allow('', null).empty(['', null]).default(null),
        pysichal_activity: Joi.number().allow('', null).empty(['', null]).default(0),
        smoking: Joi.number().allow('', null).empty(['', null]).default(0),
        consume_alcohol: Joi.number().allow('', null).empty(['', null]).default(0),
        income: Joi.number().allow('', null).empty(['', null]).default(0),
        travel: Joi.number().allow('', null).empty(['', null]).default(2),
        visited: Joi.string().allow('', null).default(null),
        start_travel: Joi.date().allow('', null).empty(['', null]).default(null),
        end_travel: Joi.date().allow('', null).empty(['', null]).default(null),
        close_contact: Joi.number().allow('', null).empty(['', null]).default(0),
        id_close_contact: Joi.string().allow('', null).default(null),
        name_close_contact: Joi.string().allow('', null).default(null),
        close_contact_confirm: Joi.number().allow('', null).empty(['', null]).default(0),
        id_close_contact_confirm: Joi.string().allow('', null).default(null),
        name_close_contact_confirm: Joi.string().allow('', null).default(null),
        close_contact_animal_market: Joi.number().allow('', null).empty(['', null]).default(0),
        animal_market_date: Joi.date().allow('', null).empty(['', null]).default(null),
        animal_market_other: Joi.string().allow('', null).default(null),
        close_contact_public_place: Joi.number().allow('', null).empty(['', null]).default(0),
        public_place_date: Joi.date().allow('', null).empty(['', null]).default(null),
        public_place_other: Joi.string().allow('', null).default(null),
        close_contact_medical_facility: Joi.number().allow('', null).empty(['', null]).default(0),
        medical_facility_date: Joi.date().allow('', null).empty(['', null]).default(null),
        medical_facility_other: Joi.string().allow('', null).empty(['', null]).default(null),
        close_contact_heavy_ispa_group:Joi.number().allow('', null).empty(['', null]).default(0),
        close_contact_health_worker:Joi.number().allow('', null).empty(['', null]).default(0),
        health_workers: Joi.string().allow('', null).empty(['', null]).default(null),
        apd_use: Joi.array().allow('', null).empty(['', null]).default([]),
        verified_comment: Joi.string().allow('', null).empty(['', null]).default(null),
        transfer_comment: Joi.string().allow('', null).empty(['', null]).default(null),
        transfer_to_unit_id: Joi.string().required(),
        transfer_to_unit_name: Joi.string().required(),
        is_test_masif: Joi.boolean().allow('', null).empty(['', null]).default(false),
        fasyankes_type: Joi.string().allow('', null).empty(['', null]).default(null),
        fasyankes_code: Joi.string().allow('', null).empty(['', null]).default(null),
        fasyankes_name: Joi.string().allow('', null).empty(['', null]).default(null),
        fasyankes_province_code: Joi.string().allow('', null).empty(['', null]).default("32"),
        fasyankes_province_name: Joi.string().allow('', null).empty(['', null]).default("Jawa Barat"),
        fasyankes_subdistrict_code: Joi.string().allow('', null).default(null),
        fasyankes_subdistrict_name: Joi.string().allow('', null).default(null),
        fasyankes_village_code: Joi.string().allow('', null).default(null),
        fasyankes_village_name: Joi.string().allow('', null).default(null),
        ...historyPayload
    }).unknown(),
    options: validateOptions.options,
    failAction: validateOptions.failAction
  }

const CaseTransferPayloadValidations = Object.assign({
    payload: CaseTransferPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const CaseTransferActPayloadValidations = Object.assign({
    payload: CaseTransferActionPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, TransferActionParamsValidations)

module.exports = {
    CaseTransferPayloadValidations,
    CaseTransferActPayloadValidations,
    TransferCaseListParamValidations,
    RequestPayload
}
