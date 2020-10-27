const { replyJson } = require('../helpers')
const { funcNoParam } = require('../../helpers/request')

/**
 * GET /api/country
 */
const listCountry = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "country", "getCountryList",
      reply, replyJson
    )
  }
}

/**
 * GET /api/menu
 */
const listMenu = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "country", "getMenuList",
      reply, replyJson
    )
  }
}

module.exports = { listCountry, listMenu }