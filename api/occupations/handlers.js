const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructAreasResponse(occupations) {
    let jsonOccupations = {
      status: 200,
      message: "Success",
      data: occupations
    }
    return jsonOccupations
  }

  return {
    /**
     * GET /api/occupations
     * @param {*} request
     * @param {*} reply
     */
    async ListOccupation(request, reply) {
      server.methods.services.occupations.getOccupation(
        request.query,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructAreasResponse(result)
          ).code(200)
        }
      )
    },

    /**
     * GET /api/occupations/{id}
     * @param {*} request
     * @param {*} reply
     */
    async GetOccupationDetail(id, reply) {
      server.methods.services.occupations.getOccupationDetail(
        id,
        (err, occupations) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructAreasResponse(occupations)
          ).code(200)
        }
      )
    },
  }//end
}