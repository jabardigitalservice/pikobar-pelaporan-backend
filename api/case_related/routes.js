module.exports = (server) => {
  const handlers = require('./handlers')(server)
  return [
    {
      method: 'GET',
      path: '/case-related',
      config: {
        auth: 'jwt',
        description: 'show case related',
        tags: ['api', 'case related'],
      },
      handler: handlers.caseRelatedList,
    },
    {
      method: 'GET',
      path: '/case-related/{id_case}',
      config: {
        auth: 'jwt',
        description: 'get by case related',
        tags: ['api', 'case related'],
      },
      handler: handlers.caseRelatedById,
    },
    {
      method: 'PATCH',
      path: '/case-related/sync',
      config: {
        auth: 'jwt',
        description: 'sync case related',
        tags: ['api', 'sync case related'],
      },
      handler: handlers.caseRelatedSync,
    },
  ]
}
