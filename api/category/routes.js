module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)

    return [
        {
            method: 'POST',
            path: '/category-target',
            config: {
                auth: 'jwt',
                description: 'create category',
                tags: ['api', 'category-target']
            },
            handler: handlers.createCategory
        },
        {
            method: 'GET',
            path: '/category-target',
            config: {
                auth: 'jwt',
                description: 'show target by category',
                tags: ['api', 'category-target'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.getListTarget
        },
        {
            method: 'GET',
            path: '/category-target/{id}',
            config: {
                auth: 'jwt',
                description: 'show target by category',
                tags: ['api', 'category-target'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.getListTargetByCategory
        },
        {
            method: 'GET',
            path: '/type-specimens',
            config: {
                auth: 'jwt',
                description: 'type Specimens',
                tags: ['api', 'type-specimens'],
                pre: [
                    CheckRoleView
                ]
            },
            handler: handlers.getTypeSpeciment
        }
    ]

}