module.exports = (server) =>{
  const handlers = require('./handlers')
  const getCaseById = require('./route_prerequesites').getCasebyId(server)
  const getContactCaseById = require('./route_prerequesites').getContactCaseById(server)
  const isAccessGranted = require('./route_prerequesites').isAccessGranted(server)

  const route = (method, path, callback) => {
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} close-contacts`,
        tags: [ 'api', 'list', 'close_contacts', ],
        pre: [ getCaseById, getContactCaseById, isAccessGranted ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/cases/{caseId}/closecontact', 'ListClosecontactCase'),
    route('POST', '/cases/{caseId}/closecontact', 'CreateClosecontact'),
    route('PUT', '/cases/{caseId}/closecontact', 'updateClosecontact'),
    route('GET', '/cases/{caseId}/closecontact/{contactCaseId}', 'DetailClosecontact'),
    route('PUT', '/cases/{caseId}/closecontact/{contactCaseId}', 'UpdateClosecontact'),
    route('DELETE', '/cases/{caseId}/closecontact/{contactCaseId}', 'DeleteClosecontact'),
  ]
}
