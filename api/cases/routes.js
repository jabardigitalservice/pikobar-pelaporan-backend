module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output')

    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
    const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

    const countCaseByDistrict = require('./route_prerequesites').countCaseByDistrict(server)
    const countCasePendingByDistrict = require('./route_prerequesites').countCasePendingByDistrict(server)
    const checkIfDataNotNull = require('./route_prerequesites').checkIfDataNotNull(server)
    const getCasebyId = require('./route_prerequesites').getCasebyId(server)
    const DataSheetRequest = require('./route_prerequesites').DataSheetRequest(server)
    const validationBeforeInput = require('./route_prerequesites').validationBeforeInput(server)
    const checkCaseIsExists = require('./route_prerequesites').checkCaseIsExists(server)
    const getDetailCase = require('./route_prerequesites').getDetailCase(server)
    const checkCaseIsAllowToDelete = require('./route_prerequesites').checkCaseIsAllowToDelete(server)

    return [
        // Get list case
        {
            method: 'GET',
            path: '/cases',
            config: {
                auth: 'jwt',
                description: 'show list of all cases',
                tags: ['api', 'cases'],
                validate: inputValidations.CaseQueryValidations,
                 // keterangan response ini gak perlu di pakai karena sudah di validation
                // ketika input
                // response: outputValidations.ListCaseOutputValidationsConfig,
                pre: [
                    CheckRoleView,
                    checkIfDataNotNull
                ]
            },
            handler: handlers.ListCase
        },
        // Create case
        {
            method: 'POST',
            path: '/cases',
            config: {
                auth: 'jwt',
                description: 'create new cases',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleCreate,
                    // validationBeforeInput, // sementara jangan di pake karena untuk integrasi API,
                    countCaseByDistrict,
                    countCasePendingByDistrict,
                    // checkCaseIsExists, // sementara jangan di pake karena cek nik

                ]
            },
            handler: handlers.CreateCase
        },
        // Get detail case
        {
            method: 'GET',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseDetail
        },
        // Get case's history
        {
            method: 'GET',
            path: '/cases/{id}/history',
            config: {
                auth: 'jwt',
                description: 'show a specific cases history',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseHistory
        },

        // Get last history of case
        {
            method: 'GET',
            path: '/cases/{id}/last-history',
            config: {
                auth: 'jwt',
                description: 'show the last history of case',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseHistoryLast
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary',
            config: {
                auth: 'jwt',
                description: 'Get cases summary of last status',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummary
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary-final',
            config: {
                auth: 'jwt',
                description: 'Get cases summary of final result',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummaryFinal
        },

        // Get case's summary of last status
        {
            method: 'GET',
            path: '/cases-summary-by-district',
            config: {
                auth: 'jwt',
                description: 'Get count summary of all cases by district',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummaryByDistrict
        },

        // Export excell case
        {
            method: 'GET',
            path: '/cases-export',
            config: {
                auth: 'jwt',
                description: 'Get count summary of all cases by district',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.ListCaseExport
        },

        // Export Case to epidemiological investigation Form (PDF)
        {
            method: 'GET',
            path: '/cases/{id}/export-to-pe-form',
            config: {
                auth: 'jwt',
                description: 'Export Case to epidemiological investigation Form',
                tags: ['api', 'epidemiological.investigation.form'],
                pre: [ getCasebyId ],
            },
            handler: handlers.EpidemiologicalInvestigationForm
        },

        // Update case
        {
            method: 'PUT',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases details',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleUpdate,
                    countCaseByDistrict,
                    countCasePendingByDistrict,
                    getCasebyId,
                    checkCaseIsExists,
                ]
            },
            handler: handlers.UpdateCase
        },
        {
            method: 'DELETE',
            path: '/cases/{id}',
            config: {
                auth: 'jwt',
                description: 'soft delete by id cases',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleDelete,
                    getCasebyId,
                    checkCaseIsAllowToDelete
                ]
            },
            handler: handlers.DeleteCase
        },
        // Import excel case
        {
            method: 'POST',
            path: '/cases-import',
            config: {
                auth: 'jwt',
                description: 'Cases import',
                tags: ['api', 'cases'],
                validate: inputValidations.CaseImportPayloadValidations,
                payload: {
                    maxBytes: 1000 * 1000 * 25,
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data'
                },
                pre: [
                    CheckRoleCreate,
                    DataSheetRequest,
                ]
            },
            handler: handlers.ImportCases
        },
        // Get case name and id
        {
            method: 'GET',
            path: '/cases-listid',
            config: {
                auth: 'jwt',
                description: 'Get case name and id',
                tags: ['api', 'cases']
            },
            handler: handlers.GetIdCase
        },
        // Get detail case by nik
        {
            method: 'GET',
            path: '/cases-by-nik/{nik}',
            config: {
                auth: 'jwt',
                description: 'show a specific cases details by nik',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseDetailByNik
        },
        // Healthcheck endpoint
        {
            method: 'GET',
            path: '/cases-healthcheck',
            config: {
                auth: 'jwt',
                description: 'display some healthcheck info regarding cases data',
                tags: ['api', 'cases'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.HealthCheck
        },
        // get case verifications
        {
            method: 'GET',
            path: '/cases/{id}/verifications',
            config: {
                auth: 'jwt',
                description: 'Get case verifications',
                tags: ['api', 'cases.verifications'],
                pre: [
                    CheckRoleView,
                ]
            },
            handler: handlers.GetCaseVerifications
        },
        // create verifications
        {
            method: 'POST',
            path: '/cases/{id}/verifications',
            config: {
                auth: 'jwt',
                description: 'Create case verifications',
                tags: ['api', 'cases.verifications'],
                validate: inputValidations.CaseVerifyPayloadValidations,
                pre: [
                    CheckRoleCreate,
                    getDetailCase
                ]
            },
            handler: handlers.CreateCaseVerification
        },
        // Get case's summary of verifications
        {
            method: 'GET',
            path: '/cases-summary-verification',
            config: {
                auth: 'jwt',
                description: 'Get a case verification summary',
                tags: ['api', 'cases.summary.verification'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.GetCaseSummaryVerification
        }
    ]
}
