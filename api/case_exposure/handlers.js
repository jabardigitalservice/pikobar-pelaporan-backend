const { replyJson } = require('../helpers')
const { createIfSame, updateIfSame, funcIfSame } = require('../../helpers/request')
const createCaseExposure = (server) => {
  return async (request, reply) => {
    await createIfSame(
      server, request, "id_case",
      reply, "case_exposure", replyJson
    )
  }
}

const getCaseExposure = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case",
      reply, "case_exposure", "read", replyJson
    )
  }
}

const updateCaseExposure = (server) => {
  return async (request, reply) => {
    await updateIfSame(
      server, request, "id_case_exposure",
      reply, "case_exposure", replyJson
    )
  }
}

const deleteCaseExposure = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, request, "id_case_exposure",
      reply, "case_exposure", "delete", replyJson
    )
  }
}
/**
 * /api/case-exposure
 * @param {*} request
 * @param {*} reply
 */
module.exports = {
  createCaseExposure,
  getCaseExposure,
  updateCaseExposure,
  deleteCaseExposure
}