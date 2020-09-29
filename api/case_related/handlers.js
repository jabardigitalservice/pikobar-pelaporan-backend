const replyHelper = require('../helpers');

module.exports = (server) => {
  const caseRelatedResponse = (caseRelated) => {
    let result = {
      status: 200,
      message: "Success",
      data: caseRelated,
    }
    return result;
  };

  return {
    /**
     * GET /api/case-related
     * @param {*} request
     * @param {*} reply
     */
    async caseRelatedList(request, reply) {
      server.methods.services.case_related.list(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
          return reply(caseRelatedResponse(result)).code(200);
        }
      )
    },
    async caseRelatedById(request, reply) {
      server.methods.services.case_related.getById(request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
          return reply(caseRelatedResponse(result, request)).code(200);
        }
      )
    },
    async caseRelatedSync(request, reply) {
      server.methods.services.case_related.sync(
        server.methods.services,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
          return reply(caseRelatedResponse(result, request)).code(200);
        }
      )
    },
  } //end
}
