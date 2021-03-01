module.exports = (server, route) => {
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleRud = require('../users/route_prerequesites').CheckRoleCreate(server)

  return [
    route(
      server, 'POST', '/public-place/{id_case}',
      'public_place', CheckRoleRud, 'createPublicPlace'
    ),route(
      server, 'GET', '/public-place/{id_case}',
      'public_place', CheckRoleView, 'getPublicPlace'
    ),route(
      server, 'PUT', '/public-place/{id_public_place}',
      'public_place', CheckRoleRud, 'updatePublicPlace'
    ),route(
      server, 'DELETE', '/public-place/{id_public_place}',
      'public_place', CheckRoleRud, 'deletePublicPlace'
    )
  ]
}