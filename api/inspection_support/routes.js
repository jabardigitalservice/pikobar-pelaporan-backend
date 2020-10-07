module.exports = (server) => {
  const handlers = require('./handlers')
  const { roles } = require("../../helpers/routes")

  const route = (method, path, callback, role) => {
    return {
      method: method,
      path: path,
      config: {
        description: `${method} inspection-support`,
        tags: ['api', 'inspection-support'],
        pre: [ role ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/inspection-support/{id_case}', 'getInspectionSupport', roles(server).view),
    route('POST', '/inspection-support/{id_case}', 'createInspectionSupport', roles(server).create),
    route('PUT', '/inspection-support/{id_inspection_support}', 'updateInspectionSupport', roles(server).update),
    route('DELETE', '/inspection-support/{id_inspection_support}', 'deleteInspectionSupport', roles(server).delete),
  ]
}