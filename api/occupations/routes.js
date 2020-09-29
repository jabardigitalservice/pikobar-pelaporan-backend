module.exports = (server) => {
  const handlers = require('./handlers')(server)

  return [
    {
      method: 'GET',
      path: '/occupations',
      config: {
        auth: 'jwt',
        description: 'show occupations',
        tags: ['api', 'occupations'],
      },
      handler: handlers.ListOccupation
    },
    {
      method: 'GET',
      path: '/occupations/{id}',
      config: {
        auth: 'jwt',
        description: 'show detail occupation',
        tags: ['api', 'occupations'],
      },
      handler: handlers.GetOccupationDetail
    }
  ]
}