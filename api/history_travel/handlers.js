const { replyJson } = require('../helpers')
const { createIfSame, updateIfSame, funcIfSame } = require('../../helpers/request')
/**
 * /api/history-travel
 * @param {*} request
 * @param {*} reply
*/
const createHistoryTravel = (server) => {
  return async (request, reply) => {
    await createIfSame(
      server, request, "id_case",
      reply, "history_travel", replyJson
    )
  }
}

const getHistoryTravel = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case",
      reply, "public_place", "read", replyJson
    )
  }
}

const updateHistoryTravel = (server) => {
  return async (request, reply) => {
    await updateIfSame(
      server, request, "id_history_travel",
      reply, "history_travel", replyJson
    )
  }
}

const deleteHistoryTravel = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_public_place",
      reply, "public_place", "delete", replyJson
    )
  }
}

module.exports = {
  createHistoryTravel,
  updateHistoryTravel,
  getHistoryTravel,
  deleteHistoryTravel
}