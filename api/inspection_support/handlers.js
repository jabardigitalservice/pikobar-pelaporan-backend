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
}
module.exports = {
  createInspectionSupport,
  getInspectionSupport,
  updateInspectionSupport,
  deleteInspectionSupport
}