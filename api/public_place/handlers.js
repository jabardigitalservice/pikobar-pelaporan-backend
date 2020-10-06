const { replyJson } = require('../helpers')
/**
 * /api/public-place
 * @param {*} request
 * @param {*} reply
*/
const createPublicPlace = (server) => {
  return (request, reply) => {
    server.methods.services.public_place.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const getPublicPlace = (server) => {
  return (request, reply) => {
    server.methods.services.public_place.read(
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const updatePublicPlace = (server) => {
  return (request, reply) => {
    server.methods.services.public_place.update(
      request.params.id_public_place,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const deletePublicPlace = (server) => {
  return (request, reply) => {
    const { id_public_place } = request.params
    server.methods.services.public_place.delete(
      id_public_place,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}
module.exports = {
  createPublicPlace,
  getPublicPlace,
  updatePublicPlace,
  deletePublicPlace
}