const replyHelper = require('../helpers');

module.exports = (server) => {
  function historyTravelResponse(historyTravel) {
    let jsonHistoryTravel = {
      status: 200,
      message: "Success",
      data: historyTravel
    }
    return jsonHistoryTravel
  };
  return {
    /**
     * POST /api/history-travel
     * @param {*} request
     * @param {*} reply
     */
    async createHistoryTravel(request, reply) {
      server.methods.services.history_travel.create(
        request.payload,
        request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyTravelResponse(result, request)
          ).code(200)
        }
      )
    },
    async getHistoryTravel(request, reply) {
      server.methods.services.history_travel.read(
        request.params.id_case,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyTravelResponse(result, request)
          ).code(200)
        }
      )
    },
    async updateHistoryTravel(request, reply) {
      server.methods.services.history_travel.update(
        request.params.id_history_travel,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyTravelResponse(result, request)
          ).code(200)
        }
      )
    },
    async deleteHistoryTravel(request, reply) {
      server.methods.services.history_travel.delete(
        request.params.id_history_travel,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            historyTravelResponse(result, request)
          ).code(200)
        }
      )
    }
  };
}