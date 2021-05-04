module.exports = (server) => {
  const handlers = require('./handlers')
  const inputValidations = require('./validations/input')
  //const outputValidations = require('./validations/output')

  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  const countRdtCode = require('./route_prerequesites').countRdtCode(server)
  const getRdtbyId = require('./route_prerequesites').getRdtbyId(server)
  const getCodeDinkes = require('./route_prerequesites').getCodeDinkes(server)
  const checkIfDataNotNull = require('./route_prerequesites').checkIfDataNotNull(server)
  const countCaseByDistrict = require('./route_prerequesites').countCaseByDistrict(server)
  const getCasebyIdcase = require('./route_prerequesites').getCasebyIdcase(server)
  const getDataExternal = require('./route_prerequesites').getDataExternal(server)
  const searchIdcasefromExternal = require('./route_prerequesites').searchIdcasefromExternal(server)
  const searchIdcasefromInternal = require('./route_prerequesites').searchIdcasefromInternal(server)
  const getRegisteredUserfromExternal = require('./route_prerequesites').getRegisteredUserfromExternal(server)
  const validationBeforeInput = require('./route_prerequesites').validationBeforeInput(server)
  const cekHistoryCases = require('./route_prerequesites').cekHistoryCases(server)
  const createHistoryWhenPositif = require('./route_prerequesites').createHistoryWhenPositif(server)

  const route = (method, path, validates, pre, callback) => {
    return {
      method: method,
      path: path,
      config: {
        auth: 'jwt',
        description: `${method} rdt`,
        tags: [ 'api', 'rdt', ],
        pre: pre,
        validate: validates
      },
      handler: handlers[callback](server),
    }
  }


  return [
    route('GET', '/rdt', inputValidations.RdtQueryValidations, [CheckRoleView, checkIfDataNotNull], 'ListRdt'),
    route('GET', '/rdt/list-idcase', inputValidations.rdtSearchValidation, [], 'GetListIdCase'),
    route('GET', '/rdt/list-idcase-detail', null, [searchIdcasefromInternal], 'GetListIdCaseDetail'),
    route('GET', '/rdt/list-registered-user', null, [getRegisteredUserfromExternal], 'GetListRegisteredUser'),
    route('GET', '/rdt/list-location-test', null, [], 'formLocationTest'),
    route('POST', '/rdt', null, [CheckRoleCreate, countRdtCode, getCodeDinkes, cekHistoryCases, createHistoryWhenPositif], 'CreateRdt'),
    route('POST', '/rdt-multiple', null, [CheckRoleCreate], 'CreateRdtMultiple'),
    route('GET', '/rdt/{id}', null, [CheckRoleView], 'GetRdtDetail'),
    route('GET', '/rdt/{id}/histories', null, [CheckRoleView], 'GetRdtHistories'),
    route('PUT', '/rdt/{id}', null, [CheckRoleUpdate], 'UpdateRdt'),
    route('DELETE', '/rdt/{id}', null, [CheckRoleDelete, getRdtbyId], 'DeleteRdt'),
  ]
}