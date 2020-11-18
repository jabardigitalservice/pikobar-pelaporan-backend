const { funcCreatePayload, funcIfSame, queryParamSame } = require('../../helpers/request')

const createHistoryTravel = (server) => {
  return async(request, reply) => {
    await funcCreatePayload(server, "history_travel", "create", request, "id_case", reply)
  }
}

const getHistoryTravel = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "history_travel", "read", request, "id_case", reply)
  }
}

const updateHistoryTravel = (server) => {
  return async(request, reply) => {
    await queryParamSame(
      server, "history_travel", "update",
      request, "payload", "id_history_travel", reply
    )
  }
}

const deleteHistoryTravel = (server) => {
  return async(request, reply) => {
    await funcIfSame(server, "history_travel", "delete", request, "id_history_travel", reply)
  }
}

module.exports = {
  createHistoryTravel, getHistoryTravel,  updateHistoryTravel, deleteHistoryTravel
}