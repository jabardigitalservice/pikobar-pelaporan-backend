module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
    const countCaseByDistrict = require('../cases/route_prerequesites').countCaseByDistrict(server)
    const countCasePendingByDistrict = require('../cases/route_prerequesites').countCasePendingByDistrict(server)
    const getCasebyId = require('../cases/route_prerequesites').getCasebyId(server)
    const validationBeforeInput = require('../cases/route_prerequesites').validationBeforeInput(server)
    const checkCaseIsExists = require('../cases/route_prerequesites').checkCaseIsExists(server)
    const getTransferCasebyId = require('./route_prerequesites').getTransferCasebyId(server)
    const CheckCaseIsAllowToTransfer = require('./route_prerequesites').CheckCaseIsAllowToTransfer(server)
    const CheckIsTransferActionIsAllow = require('./route_prerequesites').CheckIsTransferActionIsAllow(server)
    const CheckCredentialUnitIsExist = require('./route_prerequesites').CheckCredentialUnitIsExist(server)

    return [
        {
            method: 'GET',
            path: '/cases-transfer/{type}',
            config: {
                auth: 'jwt',
                description: 'show list of all cases',
                tags: ['api', 'cases.transfers'],
                validate: inputValidations.TransferCaseListParamValidations,
                pre: [
                    CheckRoleView,
                    CheckCredentialUnitIsExist,
                ]
            },
            handler: handlers.ListCaseTransfer
        },
        {
            method: 'POST',
            path: '/cases-transfer',
            config: {
                auth: 'jwt',
                description: 'create new cases transfer',
                tags: ['api', 'cases'],
                validate: inputValidations.RequestPayload,
                pre: [
                    CheckRoleCreate,
                    CheckCredentialUnitIsExist,
                    checkCaseIsExists,
                    validationBeforeInput,
                    countCaseByDistrict,
                    countCasePendingByDistrict
                ]
            },
            handler: handlers.CreateCaseAndTransfer
        },
        {
            method: 'GET',
            path: '/cases/{id}/transfers',
            config: {
                auth: 'jwt',
                description: 'Get case transfers',
                tags: ['api', 'cases.transfers'],
                pre: [
                    CheckRoleView,
                ]
            },
            handler: handlers.GetCaseTransfers
        },
        {
            method: 'POST',
            path: '/cases/{id}/transfers',
            config: {
                auth: 'jwt',
                description: 'Create case transfers',
                tags: ['api', 'cases.transfers'],
                validate: inputValidations.CaseTransferPayloadValidations,
                pre: [
                    CheckRoleCreate,
                    CheckCredentialUnitIsExist,
                    getCasebyId,
                    CheckCaseIsAllowToTransfer,
                ]
            },
            handler: handlers.CreateCaseTransfer
        },
        {
            method: 'POST',
            path: '/cases/{id}/transfers/{transferId}/revise',
            config: {
                auth: 'jwt',
                description: 'update cases transfer',
                tags: ['api', 'cases'],
                validate: inputValidations.RequestPayload,
                pre: [
                    CheckRoleUpdate,
                    CheckCredentialUnitIsExist,
                    CheckIsTransferActionIsAllow,
                    countCaseByDistrict,
                    countCasePendingByDistrict,
                    getTransferCasebyId,
                    getCasebyId,
                ]
            },
            handler: handlers.UpdateCaseAndTransfer
        },
        {
            method: 'POST',
            path: '/cases/{id}/transfers/{transferId}/{action}',
            config: {
                auth: 'jwt',
                description: 'Create case transfers',
                tags: ['api', 'cases.transfers'],
                validate: inputValidations.CaseTransferActPayloadValidations,
                pre: [
                    CheckRoleCreate,
                    CheckCredentialUnitIsExist,
                    CheckIsTransferActionIsAllow,
                    getTransferCasebyId
                ]
            },
            handler: handlers.ProcessCaseTransfer
        },
        {
            method: 'GET',
            path: '/cases-transfer-summary/{type}',
            config: {
                auth: 'jwt',
                description: 'Get a case transfers summary',
                tags: ['api', 'cases.summary.transfers'],
                validate: inputValidations.TransferCaseListParamValidations,
                pre: [
                    CheckRoleView,
                    CheckCredentialUnitIsExist,
                ]
            },
            handler: handlers.GetCaseSummaryTransfer
        }
    ]
}
