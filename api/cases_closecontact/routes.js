module.exports = (server) =>{
    const handlers = require('./handlers')
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getContactCaseById = require('./route_prerequesites').getContactCaseById(server)
    const isAccessGranted = require('./route_prerequesites').isAccessGranted(server)
    const thisPath = '/cases/{caseId}/closecontact'
    const specificPath = '/cases/{caseId}/closecontact/{contactCaseId}'

    return [
      {
        method: 'GET',
        path: thisPath,
        config: {
          description: 'show list of all close-contacts per-case',
          tags: [ 'api', 'list', 'close_contacts', ],
          pre: [ getCaseById, ],
          auth: 'jwt',
        },
        handler: handlers.ListClosecontactCase(server),
      },
      {
        method: 'POST',
        path: thisPath,
        config: {
          description: 'create new close contacts',
          tags: [ 'api', 'create', 'close_contacts', ],
          pre: [ getCaseById, ],
          auth: 'jwt',
        },
        handler: handlers.CreateClosecontact(server),
      },
      {
        method: 'PUT',
        path: thisPath,
        config: {
          description: 'update close contacts',
          tags: [ 'api', 'updaterecord', 'close_contacts', ],
          pre: [ getCaseById ],
          auth: 'jwt',
        },
        handler: handlers.updateClosecontact(server),
      },
      {
        method: 'GET',
        path: specificPath,
        config: {
          description: 'detail specific close contact',
          tags: [ 'api', 'detail', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById ],
          auth: 'jwt',
        },
        handler: handlers.DetailClosecontact(server),
      },
      {
        method: 'PUT',
        path: specificPath,
        config: {
          description: 'update specific close contact',
          tags: [ 'api', 'put', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById ],
          auth: 'jwt',
        },
        handler: handlers.UpdateClosecontact(server),
      },
      {
        method: 'DELETE',
        path: specificPath,
        config: {
          description: 'delete specific close contact',
          tags: [ 'api', 'delete', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById, isAccessGranted ],
          auth: 'jwt',
        },
        handler: handlers.DeleteClosecontact(server),
      },
    ]
}
