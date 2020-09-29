const inputValidations = require('./validations/input')

module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getCloseContactbyId = require('./route_prerequesites').getCloseContactbyId(server)
    // const districtInputScope = require('./route_prerequesites').districtInputScope(server)
    // THIS FILE TODO DELETED
    return [
        {
            method: 'GET',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'show list of all close-contacts per-case',
                tags: ['api', 'close_contacts']
            },
            handler: handlers.ListCloseContactCase
        },
        {
            method: 'POST',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'create new close contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.RequestPayload,
                pre: [ getCaseById, /*districtInputScope*/ ]
            },
            handler: handlers.CreateCloseContact
        },
        {
            method: 'GET',
            path: '/close-contacts',
            config: {
                auth: 'jwt',
                description: 'show list of all close-contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.QueryValidations
            },
            handler: handlers.ListCloseContact
        },
        {
            method: 'GET',
            path: '/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'show a specific close contact',
                tags: ['api', 'close_contacts']
            },
            handler: handlers.DetailCloseContact
        },
        {
            method: 'PUT',
            path: '/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'update close contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.RequestPayload,
                pre: [
                    getCloseContactbyId, /*districtInputScope*/
                ]
            },
            handler: handlers.UpdateCloseContact
        },
        {
            method: 'DELETE',
            path: '/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'delete specific close contact',
                tags: ['api', 'close_contacts'],
                pre: [
                    getCloseContactbyId
                ]
            },
            handler: handlers.DeleteCloseContact
        },
    ]
}
