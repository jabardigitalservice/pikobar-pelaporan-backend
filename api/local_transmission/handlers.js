const replyHelper = require('../helpers');

module.exports = (server) => {
  function publicLocalTransmission(localTransmission) {
    let jsonLocalTransmission = {
      status: 200,
      message: "Success",
      data: localTransmission
    }
    return jsonLocalTransmission
  };
  return {
    /**
     * POST /api/public-place
     * @param {*} request
     * @param {*} reply
     */
    async createLocalTransmission(request, reply) {
      server.methods.services.local_transmission.create(
        request.payload,
        request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicLocalTransmission(result, request)
          ).code(200)
        }
      )
    },
    async getLocalTransmission(request, reply) {
      server.methods.services.local_transmission.read(
        request.params.id_case,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicLocalTransmission(result, request)
          ).code(200)
        }
      )
    },
    async updateLocalTransmission(request, reply) {
      server.methods.services.local_transmission.update(
        request.params.id_local_transmission,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicLocalTransmission(result, request)
          ).code(200)
        }
      )
    },
    async deleteLocalTransmission(request, reply) {
      server.methods.services.local_transmission.delete(
        request.params.id_local_transmission,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicLocalTransmission(result, request)
          ).code(200)
        }
      )
    }
  };
}