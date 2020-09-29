const replyHelper = require('../../helpers')
module.exports = (server) => {
  function constructCasesResponse(cases) {
    let jsonCases = {
      status: 200,
      message: "Success",
      data: cases,
    }
    return jsonCases
  }

  return {
    /**
     * POST /api/v2/cases
     * @param {*} request
     * @param {*} reply
     */
    async CreateCase(request, reply) {
      server.methods.services.v2.cases.create(
        request.pre,
        request.payload,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(result, request)
          ).code(200)
        })
      },
      /**
       * GET /api/cases/{id}/status
       * @param {*} request
       * @param {*} reply
       */
      async GetCaseSectionStatus(request, reply) {
        let id = request.params.id
        server.methods.services.v2.cases.getCaseSectionStatus(id, (err, item) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCasesResponse(item, request)
          ).code(200)
        })
      },
  }
}
