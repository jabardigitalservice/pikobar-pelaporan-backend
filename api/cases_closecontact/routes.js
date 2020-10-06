module.exports = (server) =>{
    const handlers = require('./handlers')
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getContactCaseById = require('./route_prerequesites').getContactCaseById(server)
    const isAccessGranted = require('./route_prerequesites').isAccessGranted(server)
    const thisPath = '/cases/{caseId}/closecontact'
    const specificPath = '/cases/{caseId}/closecontact/{contactCaseId}'
    const apiPath = (method, path) => {
      return {
        method: method,
        path: path
      }
    }
    return [
      {
        ...apiPath('GET', thisPath),
        config: {
          auth: 'jwt',
          description: 'show list of all close-contacts per-case',
          tags: [ 'api', 'list', 'close_contacts', ],
          pre: [ getCaseById, ],
        },
        handler: handlers.ListClosecontactCase(server),
      },
      {
        ...apiPath('POST', thisPath),
        config: {
          auth: 'jwt',
          description: 'create new close contacts',
          tags: [ 'api', 'create', 'close_contacts', ],
          pre: [ getCaseById, ],
        },
        handler: handlers.CreateClosecontact(server),
      },
      {
        ...apiPath('PUT', thisPath),
        config: {
          auth: 'jwt',
          description: 'update close contacts',
          tags: [ 'api', 'updaterecord', 'close_contacts', ],
          pre: [ getCaseById ],
        },
        handler: handlers.updateClosecontact(server),
      },
      {
        ...apiPath('GET', specificPath),
        config: {
          auth: 'jwt',
          description: 'detail specific close contact',
          tags: [ 'api', 'detail', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById ],
        },
        handler: handlers.DetailClosecontact(server),
      },
      {
        ...apiPath('PUT', specificPath),
        config: {
          auth: 'jwt',
          description: 'update specific close contact',
          tags: [ 'api', 'put', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById ],
        },
        handler: handlers.UpdateClosecontact(server),
      },
      {
        ...apiPath('DELETE', specificPath),
        config: {
          auth: 'jwt',
          description: 'delete specific close contact',
          tags: [ 'api', 'delete', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById, isAccessGranted ],
        },
        handler: handlers.DeleteClosecontact(server),
      },
    ]
}
