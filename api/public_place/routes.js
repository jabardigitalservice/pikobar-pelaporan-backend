module.exports = (server, route, checkRole) => {
  const roleView = checkRole.viewOnly
  const roleCud = checkRole.createUpdateDelete

  return [
    route(
      server, 'POST', '/public-place/{id_case}',
      'public_place', roleCud, 'createPublicPlace'
    ),route(
      server, 'GET', '/public-place/{id_case}',
      'public_place', roleView, 'getPublicPlace'
    ),route(
      server, 'PUT', '/public-place/{id_public_place}',
      'public_place', roleCud, 'updatePublicPlace'
    ),route(
      server, 'DELETE', '/public-place/{id_public_place}',
      'public_place', roleCud, 'deletePublicPlace'
    )
  ]
}