module.exports = (server) => {
  const route = (method, path, callback) => {
    const handlers = require('./handlers')(server)
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} case related`,
        tags: ['api', 'list', 'case related',],
        auth: 'jwt',
      },
      handler: handlers[callback],
    }
  }
  return [
    route('GET', '/case-related', 'caseRelatedList'),
    route('GET', '/case-related/{id_case}', 'caseRelatedById'),
    route('PATCH', '/case-related/sync', 'caseRelatedSync'),
  ]
}
