module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getContactCaseById = require('./route_prerequesites').getContactCaseById(server)
    const isAccessGranted = require('./route_prerequesites').isAccessGranted(server)

    return [
      {
        method: 'GET',
        path: '/cases/{caseId}/closecontact',
        config: {
          auth: 'jwt',
          description: 'show list of all close-contacts per-case',
          tags: [ 'api', 'close_contacts', ],
          pre: [ getCaseById, ],
        },
        handler: handlers.ListClosecontactCase,
      },
      {
        method: 'POST',
        path: '/cases/{caseId}/closecontact',
        config: {
          auth: 'jwt',
          description: 'create new close contacts',
          tags: [ 'api', 'close_contacts', ],
          pre: [ getCaseById, ],
        },
        handler: handlers.CreateClosecontact,
      },
      {
        method: 'PUT',
        path: '/cases/{caseId}/closecontact',
        config: {
          auth: 'jwt',
          description: 'update close contacts',
          tags: [ 'api', 'close_contacts', ],
          pre: [ getCaseById ],
        },
        handler: handlers.updateClosecontact,
      },
      {
        method: 'DELETE',
        path: '/cases/{caseId}/closecontact/{contactCaseId}',
        config: {
          auth: 'jwt',
          description: 'delete specific close contact',
          tags: [ 'api', 'close_contacts', ],
          pre: [ getCaseById, getContactCaseById, isAccessGranted ],
        },
        handler: handlers.DeleteClosecontact,
      },
    ]
}
