const { replyJson } = require('../helpers')
const { createIfSame, updateIfSame, funcIfSame } = require('../../helpers/request')
/**
 * /api/local-transmission
 * @param {*} request
 * @param {*} reply
*/
const createLocalTransmission = (server) => {
  return async (request, reply) => {
    await createIfSame(
      server, request, "id_case",
      reply, "local_transmission", replyJson
    )
  }
}

const getLocalTransmission = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case",
      reply, "local_transmission", "read", replyJson
    )
  }
}

const updateLocalTransmission = (server) => {
  return async (request, reply) => {
    await updateIfSame(
      server, request, "id_local_transmission",
      reply, "local_transmission", replyJson
    )
  }
}

const deleteLocalTransmission = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_local_transmission",
      reply, "local_transmission", "delete", replyJson
    )
  }
}
module.exports = {
  getLocalTransmission,
  updateLocalTransmission,
  createLocalTransmission,
  deleteLocalTransmission
}