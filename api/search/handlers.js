const replyHelper = require('../helpers');

module.exports = (server) => {
  function listCases(cases) {
    let jsonListCase = {
      status: 200,
      message: "Success",
      data: cases
    }
    return jsonListCase
  };
  return {
  /**
   * GET /api/search
   * @param {*} request
   * @param {*} reply
   */
    async getCases(request, reply) {
      server.methods.services.search.getCases(
        request.query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            listCases(result, request)
          ).code(200)
        }
      )
    }
  }
}