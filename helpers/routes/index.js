const configRoute = (description, tags, role) => {
  return  {
    auth: 'jwt',
    description: description,
    tags: ['api', tags],
    pre: [ role ]
  }
}

const configWithValidation = (description, tags, validations, role) => {
  return  {
    auth: 'jwt',
    description: description,
    tags: ['api', tags],
    validate: validations.caseDashboard,
    pre: [ role ]
  }
}

const roles = (server) => {
  const CheckRoleView = require('../../api/users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../../api/users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../../api/users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../../api/users/route_prerequesites').CheckRoleDelete(server)

  return  {
    view: CheckRoleView,
    create: CheckRoleCreate,
    update: CheckRoleUpdate,
    delete: CheckRoleDelete
  }
}

const route = (method, path, handlers, role) => {
  const description = `${method} ${path}`
  return {
    method: method,
    path: path,
    config: {
      description: description,
      tags: ['api', description],
      pre: [ role ],
      auth: 'jwt',
    },
    handler: handlers,
  }
}

module. exports = { configRoute, configWithValidation, roles, route }