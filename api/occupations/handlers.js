const { replyJson } = require('../helpers')
const { queryIfSame, funcCreate } = require('../../helpers/request')

/**
 * GET /api/occupations
 */
const ListOccupation = (server) => {
  return async (request, reply) => {
    await queryIfSame(
      server, "occupations", "getOccupation",
      request, reply, replyJson
    )
  }
}

const GetOccupationDetail = (server) => {
  return async (request, reply) => {
    await funcCreate(
      server, "occupations", "getOccupationDetail",
      request, reply, replyJson
    )
  }
}

module.exports = { ListOccupation, GetOccupationDetail }