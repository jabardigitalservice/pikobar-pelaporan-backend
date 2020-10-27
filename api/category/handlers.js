const { replyJson } = require('../helpers')
const { funcCreate, funcNoParam, funcIfSame } = require('../../helpers/request')

/**
 * /api/category
 * @param {*} request
 * @param {*} reply
*/

const createCategory = (server) => {
  return async (request, reply) => {
    await funcCreate(
      server, "category", "create",
      request, reply, replyJson
    )
  }
}

const getListTarget = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "category", "list",
      reply, replyJson
    )
  }
}

const getListTargetByCategory = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, "category", "listTargetByCategory",
      request, "id", reply, replyJson
    )
  }
}

const getTypeSpeciment = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "category", "typeSpeciment",
      reply, replyJson
    )
  }
}

module.exports = {
  createCategory, getTypeSpeciment,
  getListTarget, getListTargetByCategory
}