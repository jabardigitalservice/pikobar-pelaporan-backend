const { funcNoParam } = require('../../helpers/request')
const { replyJson } = require('../helpers')
const { clientConfig } = require('../../config/redis')

module.exports = (server) => {
  return {
    /**
     * GET /api/country
     * @param {*} request
     * @param {*} reply
     */
    async listCountry(request, reply) {
      await funcNoParam(server, "country", "getCountryList", reply)
    },
    async listMenu(request, reply) {
      await funcNoParam(server, "country", "getMenuList", reply)
    },
    async clearCache(request, reply) {
      clientConfig.del(request.query.key, function (err, result) {
        replyJson(err, result, reply)
      });
    },
  } //end
}