const { constructErrorResponse, successResponse } = require('../helpers');

const unitService = (server, name, method, req, request, reply) => {
  server.methods.services[name][method](req, (err, result) => {
    if (err) return reply(constructErrorResponse(err)).code(422)
      return reply(
        successResponse(result, request)
      ).code(200)
    }
  )
}

module.exports = (server) => {

  return {
    async getUnit(request, reply) {
      unitService(server, "unit", "read", request.query, request, reply)
    },
    async listUnitById(request, reply) {
      unitService(server, "unit", "readbyid", request.params.id, request, reply)
    }
  };
}