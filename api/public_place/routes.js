module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server);
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  const apiPath = (method, path, callback, role) => {
    return {
      method: method,
      path: path,
      config: {
        description: `${method} public-place`,
        tags: ['api', 'public-place'],
        pre: [ role ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    apiPath('GET', '/public-place/{id_case}', 'getPublicPlace', CheckRoleView),
    apiPath('POST', '/public-place/{id_case}', 'createPublicPlace', CheckRoleCreate),
    apiPath('PUT', '/public-place/{id_public_place}', 'updatePublicPlace', CheckRoleUpdate),
    apiPath('DELETE', '/public-place/{id_public_place}', 'deletePublicPlace', CheckRoleDelete),
  ]
}