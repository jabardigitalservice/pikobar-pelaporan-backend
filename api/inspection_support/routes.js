module.exports = (server, handlers, roles, route) => {
  return [
    route(
      'POST', '/inspection-support/{id_case}', 'inspection-support',
      handlers.createInspectionSupport(server), roles(server).create
    ),
    route(
      'GET', '/inspection-support/{id_case}', 'inspection-support',
      handlers.getInspectionSupport(server), roles(server).view
    ),
    route(
      'DELETE', '/inspection-support/{id_inspection_support}', 'inspection-support',
      handlers.deleteInspectionSupport(server), roles(server).delete
    ),
    route(
      'PUT', '/inspection-support/{id_inspection_support}', 'inspection-support',
      handlers.updateInspectionSupport(server), roles(server).update
    )
  ]
}