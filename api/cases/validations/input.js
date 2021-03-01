const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')
const { VERIFIED_STATUS } = require('../../../helpers/constant')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------

const CaseCreatePayload = Joi.object().keys({

})

const CaseUpdatePayload = Joi.object().keys({
    Case_name: Joi.string().optional(),
    category: Joi.string().optional(),
    using_for: Joi.string().optional(),
    description: Joi.string().optional(),
    introduction: Joi.string().optional(),
    periode_start: Joi.date().optional(),
    periode_end: Joi.date().optional(),
    respondent_target: Joi.number().optional(),
    status: Joi.string().optional()
})

const CaseVerifyPayload = Joi.object().keys({
    verified_status: Joi.string().valid(...Object.values(VERIFIED_STATUS)).required(),
    verified_comment: Joi.string().allow('', null).optional()
})

const CaseParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}

// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------
const CaseQueryValidations = {
    query: {
        limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
        sort: Joi.string().description('sorting data'),
        address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa'),
        address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by Case name'),
        name_case_related: Joi.string().empty('', null).default('').description('search data by Case name'),
        search: Joi.string().empty('', null).default('').description('search data by Case name'),
        stage: Joi.string().empty('', null).default('').description('search data by stage'),
        status: Joi.string().empty('', null).default('').description('search data by status'),
        final_result: Joi.string().empty('', null).default('').description('search data by final_result'),
        start_date: Joi.string().empty('', null).default('').description('search data by test date'),
        end_date: Joi.string().empty('', null).default('').description('search data by test date'),
        author: Joi.string().empty('', null).default('').description('filter by author'),
        verified_status: Joi.string().empty('', null).default('').description('filter by verified status'),
        transfer_status: Joi.string().optional().valid('pending', 'declined', 'approved').description('filter by transfer status')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const CaseImportPayload = Joi.object().keys({
    file: Joi.any()
        .required()
        .description('xlsx file')
})

const CaseCreatePayloadValidations = {
    payload: CaseCreatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const CaseUpdatePayloadValidations = Object.assign({
    payload: CaseUpdatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)


const CaseDeletePayloadValidations = Object.assign({
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const CaseImportPayloadValidations = {
    payload: CaseImportPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

const CaseVerifyPayloadValidations = Object.assign({
    payload: CaseVerifyPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const modules = {
  CaseParamsValidations,
  CaseQueryValidations,
  CaseCreatePayloadValidations,
  CaseUpdatePayloadValidations,
  CaseDeletePayloadValidations,
  CaseImportPayloadValidations,
  CaseVerifyPayloadValidations
}

module.exports = modules
