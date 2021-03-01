const replyHelper = require('../helpers')
const {funcNoParam} = require('../../helpers/request')

module.exports = (server) => {
    function constructAreasResponse(country) {
        let jsonCountry = {
            status: 200,
            message: "Success",
            data: country
        }
        return jsonCountry
    }

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
    } //end
}