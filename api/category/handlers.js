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
      request, reply
    )
  }
}

const getListTarget = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "category", "list",
      reply
    )
  }
}

const getListTargetByCategory = (server) => {
  return async (request, reply) => {
    await funcIfSame(
      server, "category", "listTargetByCategory",
      request, "id", reply
    )
  }
}

const getTypeSpeciment = (server) => {
  return async (_request, reply) => {
    await funcNoParam(
      server, "category", "typeSpeciment",
      reply
    )
  }
}

module.exports = {
  createCategory, getTypeSpeciment,
  getListTarget, getListTargetByCategory
}