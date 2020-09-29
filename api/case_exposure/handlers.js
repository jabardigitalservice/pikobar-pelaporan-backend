const replyHelper = require('../helpers');

module.exports = (server) => {
  function historyCaseExposure(caseExposure) {
    let jsonExposure = {
      status: 200,
      message: "Success",
      data: caseExposure
    }
    return jsonExposure
  };
  return {
    /**
     * POST /api/case-exposure
     * @param {*} request
     * @param {*} reply
     */
    async createCaseExposure(request, reply) {
      server.methods.services.case_exposure.create(
        request.payload,
        request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyCaseExposure(result, request)
          ).code(200)
        }
      )
    },
    async getCaseExposure(request, reply) {
      server.methods.services.case_exposure.read(
        request.params.id_case,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyCaseExposure(result, request)
          ).code(200)
        }
      )
    },
    async updateCaseExposure(request, reply) {
      server.methods.services.case_exposure.update(
        request.params.id_case_exposure,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyCaseExposure(result, request)
          ).code(200)
        }
      )
    },
    async deleteCaseExposure(request, reply) {
      server.methods.services.case_exposure.delete(
        request.params.id_case_exposure,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyCaseExposure(result, request)
          ).code(200)
        }
      )
    }
  };
}