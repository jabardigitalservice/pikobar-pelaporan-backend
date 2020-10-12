const { replyJson } = require('../helpers')
const { funcIfSame } = require('../../helpers/request')
/**
 * /api/occupations
 * @param {*} request
 * @param {*} reply
*/
const ListOccupation = (server) => {
  return async (_request, reply) => {
    await server.methods.services.occupations.getOccupation(
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const GetOccupationDetail = (server) => {
  return async (request, reply) => {
    await server.methods.services.occupations.getOccupationDetail(
      request,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = { ListOccupation, GetOccupationDetail }