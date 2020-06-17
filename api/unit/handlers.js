const replyHelper = require('../helpers');

module.exports = (server) => {
    function constructUnitResponse(unit) {
        let jsonUnit = {
            status: 200,
            message: "Success",
            data: unit
        }
        return jsonUnit
    };
    return {
        /**
         * GET /api/unit
         * @param {*} request
         * @param {*} reply
         */
        async createUnit(request,reply){
            server.methods.services.unit.create(request.payload,
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
        async getUnit(request,reply){
            server.methods.services.unit.read(request.query, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
        async updateUnit(request,reply){
            server.methods.services.unit.update(
                request.payload, request.params.id,
                "update", request.auth.credentials.user._id,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
        async deleteUnit(request,reply){
            server.methods.services.unit.update(
                request.payload, request.params.id,
                "delete", request.auth.credentials.user._id,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
        async listUnitById(request,reply){
            server.methods.services.unit.readbyid(request.params.id,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
        async hospitalUnitMigrate(request,reply){
            server.methods.services.unit.migrate(request.payload,
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructUnitResponse(result,request)
                ).code(200)
                }
            )
        },
    };
}