module.exports = (server) =>{
    const handlers = require('./handlers')(server);
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
    const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server);
    const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server);
    const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server);
    const inputValidations = require('./validations/input');

    return [
        {
            method: 'POST',
            path: '/unit',
            config: {
                auth: 'jwt',
                description: 'create unit',
                tags: ['api', 'unit'],
                pre: [ CheckRoleCreate ],
                // validate: inputValidations.postPayload,
            },
            handler: handlers.createUnit
        },
        {
            method: 'GET',
            path: '/unit',
            config: {
                auth: 'jwt',
                description: 'show list unit',
                tags: ['api', 'unit'],
                validate: inputValidations.UnitQueryValidations,
                pre: [ CheckRoleView ]
            },
            handler: handlers.getUnit
        },
        {
            method: 'GET',
            path: '/unit/{id}',
            config: {
                auth: 'jwt',
                description: 'show unit by id',
                tags: ['api', 'unit'],
                pre: [ CheckRoleView ],
            },
            handler: handlers.listUnitById
        },
        {
            method: 'PUT',
            path: '/unit/{id}',
            config: {
                auth: 'jwt',
                description: 'update unit',
                tags: ['api', 'unit'],
                pre: [ CheckRoleUpdate ],
            },
            handler: handlers.updateUnit
        },
        {
            method: 'DELETE',
            path: '/unit/{id}',
            config: {
                auth: 'jwt',
                description: 'delete unit',
                tags: ['api', 'unit'],
                pre: [ CheckRoleDelete ],
            },
            handler: handlers.deleteUnit
        },
        {
            method: 'GET',
            path: '/unit/hospital-unit-migrate',
            config: {
                auth: 'jwt',
                description: 'migrate hospital unit',
                tags: ['api', 'unit'],
            },
            handler: handlers.hospitalUnitMigrate
        }
    ]

}