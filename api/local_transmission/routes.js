module.exports = (server, handlers, roles) => {

  const route = (method, path, callback, role) => {
    return {
      method: method,
      path: path,
      config: {
        description: `${method} local-transmission`,
        tags: ['api', 'local-transmission'],
        pre: [ role ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/local-transmission/{id_case}', 'getLocalTransmission', roles(server).view),
    route('POST', '/local-transmission/{id_case}', 'createLocalTransmission', roles(server).create),
    route('PUT', '/local-transmission/{id_local_transmission}', 'updateLocalTransmission', roles(server).update),
    route('DELETE', '/local-transmission/{id_local_transmission}', 'deleteLocalTransmission', roles(server).delete),
  ]
}