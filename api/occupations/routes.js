module.exports = (server) => {
  const handlers = require('./handlers')

  return [
    {
      method: 'GET',
      path: '/occupations',
      config: {
        auth: 'jwt',
        description: 'show occupations',
        tags: ['api', 'occupations'],
      },
      handler: handlers.ListOccupation(server)
    },
    {
      method: 'GET',
      path: '/occupations/{id}',
      config: {
        auth: 'jwt',
        description: 'show detail occupation',
        tags: ['api', 'occupations'],
      },
      handler: handlers.GetOccupationDetail(server)
    }
  ]
}