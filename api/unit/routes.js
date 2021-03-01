module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const inputValidations = require('./validations/input')

  return [{
    method: 'GET',
    path: '/unit',
    config: {
      auth: 'jwt',
      description: 'show list unit',
      tags: ['api', 'unit'],
      validate: inputValidations.UnitQueryValidations,
      pre: [CheckRoleView]
    },
    handler: handlers.getUnit
  },
  {
    method: 'GET',
    path: '/unit/{id}',
    config: {
      auth: 'jwt',
      description: 'show unit by id',
      tags: ['api', 'unit'],
      pre: [CheckRoleView],
    },
    handler: handlers.listUnitById
  }
  ]
}