const { requestIfSame } = require('../../helpers/request')

/**
 * /api/map
 * @param {*} request
 * @param {*} reply
*/

const mapList = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "map", "listMap",
      request, reply
    )
  }
}

const mapSummary = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "map", "listSummary",
      request, reply
    )
  }
}
module.exports = {
  mapList, mapSummary
}