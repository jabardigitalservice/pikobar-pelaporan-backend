const { replyJson } = require('../helpers')
const {payloadPreSame, funcCreate} = require('../../helpers/request')

const injectLastHistory = (server) => {
  return async(request, reply) => {
    await funcCreate(server, "inject", "lastHistory", request, reply)
  }
}

const injectRdtTest = (server) => {
  return async (request, reply) => {
    await funcCreate(server, "inject", "injectRdt", request, reply)
  }
}

module.exports = {
  injectLastHistory,injectRdtTest
}