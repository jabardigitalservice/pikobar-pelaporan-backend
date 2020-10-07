const { replyJson } = require('../helpers')
const { createIfSame, updateIfSame, funcIfSame } = require('../../helpers/request')
/**
 * /api/public-place
 * @param {*} request
 * @param {*} reply
*/
const createPublicPlace = (server) => {
  return async (request, reply) => {
    await createIfSame(
      server, request, "id_case",
      reply, "public_place", replyJson
    )
  }
}

const getPublicPlace = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case",
      reply, "public_place", "read", replyJson
    )
  }
}

const updatePublicPlace = (server) => {
  return async (request, reply) => {
    await updateIfSame(
      server, request, "id_public_place",
      reply, "public_place", replyJson
    )
  }
}

const deletePublicPlace = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_public_place",
      reply, "public_place", "delete", replyJson
    )
  }
}
module.exports = {
  createPublicPlace,
  getPublicPlace,
  updatePublicPlace,
  deletePublicPlace
}