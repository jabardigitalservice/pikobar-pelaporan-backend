module.exports = (server) =>{
    const handlers = require('./handlers')
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getContactCaseById = require('./route_prerequesites').getContactCaseById(server)
    const isAccessGranted = require('./route_prerequesites').isAccessGranted(server)

    const apiPath = (method, path, callback) => {
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
      apiPath('GET', '/cases/{caseId}/closecontact', 'ListClosecontactCase'),
      apiPath('POST', '/cases/{caseId}/closecontact', 'CreateClosecontact'),
      apiPath('PUT', '/cases/{caseId}/closecontact', 'updateClosecontact'),
      apiPath('GET', '/cases/{caseId}/closecontact/{contactCaseId}', 'DetailClosecontact'),
      apiPath('PUT', '/cases/{caseId}/closecontact/{contactCaseId}', 'UpdateClosecontact'),
      apiPath('DELETE', '/cases/{caseId}/closecontact/{contactCaseId}', 'DeleteClosecontact'),
    ]
}
