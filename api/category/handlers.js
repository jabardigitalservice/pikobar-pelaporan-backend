const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructCategoryResponse(category) {
        let jsonCategory = {
            status: 200,
            message: "Success",
            data: category
        }
        return jsonCategory
    }

    return {
        /**
         * GET /api/category
         * @param {*} request
         * @param {*} reply
         */
        async createCategory(request,reply){
            server.methods.services.category.create(request,(err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCategoryResponse(result,request)
                ).code(200)
                }
            )
        },
        async getListTarget(request,reply){
            server.methods.services.category.list((err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCategoryResponse(result,request)
                ).code(200)
                }
            )
        },
        async getListTargetByCategory(request,reply){
            server.methods.services.category.listTargetByCategory(request.params.id,(err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCategoryResponse(result)
                    ).code(200)
                }
            )
        },
        async getTypeSpeciment(request, reply){
            server.methods.services.category.typeSpeciment((err, result) =>{
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCategoryResponse(result)
                ).code(200)
            })
        }
    }
}