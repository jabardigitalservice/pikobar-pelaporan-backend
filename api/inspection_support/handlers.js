const replyHelper = require('../helpers');

module.exports = (server) => {
  function inspectionSupport(data) {
    let jsonInspectionSupport = {
      status: 200,
      message: "Success",
      data: data
    }
    return jsonInspectionSupport
  };
  return {
    async createInspectionSupport(request, reply) {
      server.methods.services.inspection_support.create(
        request.payload,
        request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            inspectionSupport(result, request)
          ).code(200)
        }
      )
    },
    async getInspectionSupport(request, reply) {
      server.methods.services.inspection_support.read(
        request.params.id_case,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            inspectionSupport(result, request)
          ).code(200)
        }
      )
    },
    async updateInspectionSupport(request, reply) {
      server.methods.services.inspection_support.update(
        request.params.id_inspection_support,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            inspectionSupport(result, request)
          ).code(200)
        }
      )
    },
    async deleteInspectionSupport(request, reply) {
      server.methods.services.inspection_support.delete(
        request.params.id_inspection_support,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            inspectionSupport(result, request)
          ).code(200)
        }
      )
    }
  };
}