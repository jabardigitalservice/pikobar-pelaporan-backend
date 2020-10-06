const { replyJson } = require('../helpers')
/**
 * /api/history-travel
 * @param {*} request
 * @param {*} reply
*/
const createHistoryTravel = (server) => {
  return (request, reply) => {
    server.methods.services.history_travel.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const getHistoryTravel = (server) => {
  return (request, reply) => {
    server.methods.services.history_travel.read(
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const updateHistoryTravel = (server) => {
  return (request, reply) => {
    server.methods.services.history_travel.update(
      request.params.id_history_travel,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const deleteHistoryTravel = (server) => {
  return (request, reply) => {
    const { id_history_travel } = request.params
    server.methods.services.history_travel.delete(
      id_history_travel,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  createHistoryTravel,
  updateHistoryTravel,
  getHistoryTravel,
  deleteHistoryTravel
}