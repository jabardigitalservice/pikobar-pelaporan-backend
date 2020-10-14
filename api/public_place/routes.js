module.exports = (server, handlers, roles) => {
  const route = (method, path, callback, role) => {
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
    route('GET', '/public-place/{id_case}', 'getPublicPlace', roles(server).view),
    route('POST', '/public-place/{id_case}', 'createPublicPlace', roles(server).create),
    route('PUT', '/public-place/{id_public_place}', 'updatePublicPlace', roles(server).update),
    route('DELETE', '/public-place/{id_public_place}', 'deletePublicPlace', roles(server).delete),
  ]
}