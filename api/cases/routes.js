module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const inputValidations = require('./validations/input')
  const { routeWithPreOld } = require('../../helpers/routes')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  const countCaseByDistrict = require('./route_prerequesites').countCaseByDistrict(server)
  const countCasePendingByDistrict = require('./route_prerequesites').countCasePendingByDistrict(server)
  const checkIfDataNotNull = require('./route_prerequesites').checkIfDataNotNull(server)
  const getCasebyId = require('./route_prerequesites').getCasebyId(server)
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
    routeWithPreOld(server, 'GET', '/cases/{id}', 'cases', CheckRoleView, 'GetCaseDetail'),
    // Get case's history
    routeWithPreOld(server, 'GET', '/cases/{id}/history', 'cases', CheckRoleView, 'GetCaseHistory'),
    // Get last history of case
    routeWithPreOld(server, 'GET', '/cases/{id}/last-history', 'cases', CheckRoleView, 'GetCaseHistoryLast'),
    // Get case's summary of last status
    routeWithPreOld(server, 'GET', '/cases-summary', 'cases', CheckRoleView, 'GetCaseSummary'),
    // Get case's summary of last status
    routeWithPreOld(server, 'GET', '/cases-summary-by-district', 'cases', CheckRoleView, 'GetCaseSummaryByDistrict'),
    // Export excell case
    routeWithPreOld(server, 'GET', '/cases-export', 'cases', CheckRoleView, 'ListCaseExport'),
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
    routeWithPreOld(server, 'GET', '/cases-by-nik/{nik}', 'cases', CheckRoleView, 'GetCaseDetailByNik'),
    // Healthcheck endpoint
    routeWithPreOld(server, 'GET', '/cases-healthcheck', 'cases', CheckRoleView, 'HealthCheck'),
    // get case verifications
    routeWithPreOld(server, 'GET', '/cases/{id}/verifications', 'cases', CheckRoleView, 'GetCaseVerifications'),
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
    routeWithPreOld(server, 'GET', '/cases-summary-verification', 'cases', CheckRoleView, 'GetCaseSummaryVerification'),
  ]
}
