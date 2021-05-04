module.exports = (server) => {
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
  const { routeWithPreOld } = require('../../helpers/routes')
  const sameConfig = (description, valdiate, pre, method) => {
    return {
      config: {
        auth: 'jwt',
        description: description,
        tags: ['api', 'cases.transfers'],
        validate: inputValidations[valdiate],
        pre: pre
      },
      handler: handlers[method]
    }
  }

  return [
    {
      method: 'GET',
      path: '/cases-transfer/{type}',
      ...sameConfig(
        'show list of all cases', 'TransferCaseListParamValidations',
        [ CheckRoleView, CheckCredentialUnitIsExist ], 'ListCaseTransfer'
      )
    },
    {
      method: 'POST',
      path: '/cases-transfer',
      ...sameConfig(
        'create new cases transfer', 'RequestPayload',
        [ CheckRoleCreate, CheckCredentialUnitIsExist,
          checkCaseIsExists, validationBeforeInput,
          countCaseByDistrict, countCasePendingByDistrict
        ], 'CreateCaseAndTransfer'
      )
    },
    routeWithPreOld(server, 'GET', '/cases/{id}/transfers', 'cases_transfers', CheckRoleView, 'GetCaseTransfers'),
    {
      method: 'POST',
      path: '/cases/{id}/transfers',
      ...sameConfig(
        'create new cases transfer by id case', 'CaseTransferPayloadValidations',
        [ CheckRoleCreate, CheckCredentialUnitIsExist,
          getCasebyId, CheckCaseIsAllowToTransfer
        ], 'CreateCaseTransfer'
      )
    },
    {
      method: 'POST',
      path: '/cases/{id}/transfers/{transferId}/revise',
      ...sameConfig(
        'update cases transfer', 'RequestPayload',
        [ CheckRoleUpdate, CheckCredentialUnitIsExist,
          CheckIsTransferActionIsAllow, countCaseByDistrict,
          countCasePendingByDistrict, getTransferCasebyId,
          getCasebyId,
        ], 'UpdateCaseAndTransfer'
      ),
    },
    {
      method: 'POST',
      path: '/cases/{id}/transfers/{transferId}/{action}',
      ...sameConfig(
        'Create case transfers', 'CaseTransferActPayloadValidations',
        [ CheckRoleCreate, CheckCredentialUnitIsExist,
          CheckIsTransferActionIsAllow, getTransferCasebyId,
        ], 'ProcessCaseTransfer'
      )
    },
    {
      method: 'GET',
      path: '/cases-transfer-summary/{type}',
      ...sameConfig(
        'Get a case transfers summary', 'TransferCaseListParamValidations',
        [ CheckRoleView, CheckCredentialUnitIsExist ], 'GetCaseSummaryTransfer'
      )
    }
  ]
}
