const { replyJson } = require('../helpers')
const { createIfSame, updateIfSame, funcIfSame } = require('../../helpers/request')
const createInspectionSupport = (server) => {
  return async (request, reply) => {
    await createIfSame(
      server, request, "id_case",
      reply, "inspection_support", replyJson
    )
  }
}

const getInspectionSupport = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case",
      reply, "inspection_support", "read", replyJson
    )
  }
}

const updateInspectionSupport = (server) => {
  return async (request, reply) => {
    await updateIfSame(
      server, request, "id_inspection_support",
      reply, "inspection_support", replyJson
    )
  }
}

const deleteInspectionSupport = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_inspection_support",
      reply, "inspection_support", "delete", replyJson
    )
  }
  return (request, reply) => {
    server.methods.services.inspection_support.delete(
      request.params.id_inspection_support,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}
module.exports = {
  createInspectionSupport,
  getInspectionSupport,
  updateInspectionSupport,
  deleteInspectionSupport
}