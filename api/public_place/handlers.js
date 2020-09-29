const replyHelper = require('../helpers');

module.exports = (server) => {
  function publicPlaceResponse(publicPlace) {
    let jsonPublicPlace = {
      status: 200,
      message: "Success",
      data: publicPlace
    }
    return jsonPublicPlace
  };
  return {
    /**
     * POST /api/public-place
     * @param {*} request
     * @param {*} reply
     */
    async createPublicPlace(request, reply) {
      server.methods.services.public_place.create(
        request.payload,
        request.params.id_case,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicPlaceResponse(result, request)
          ).code(200)
        }
      )
    },
    async getPublicPlace(request, reply) {
      server.methods.services.public_place.read(
        request.params.id_case,
        (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicPlaceResponse(result, request)
          ).code(200)
        }
      )
    },
    async updatePublicPlace(request, reply) {
      server.methods.services.public_place.update(
        request.params.id_public_place,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicPlaceResponse(result, request)
          ).code(200)
        }
      )
    },
    async deletePublicPlace(request, reply) {
      server.methods.services.public_place.delete(
        request.params.id_public_place,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            publicPlaceResponse(result, request)
          ).code(200)
        }
      )
    }
  };
}