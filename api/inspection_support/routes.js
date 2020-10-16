module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/inspection-support/{id_case}',
      handlers.createInspectionSupport(server), roles(server).create
    ),
    route(
      'GET', '/inspection-support/{id_case}',
      handlers.getInspectionSupport(server), roles(server).view
    ),
    route(
      'DELETE', '/inspection-support/{id_inspection_support}',
      handlers.deleteInspectionSupport(server), roles(server).delete
    ),
    route(
      'PUT', '/inspection-support/{id_inspection_support}',
      handlers.updateInspectionSupport(server), roles(server).update
    )
  ]
}