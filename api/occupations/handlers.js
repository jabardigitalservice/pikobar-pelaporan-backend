const { replyJson } = require('../helpers')
const { queryIfSame } = require('../../helpers/request')


const ListOccupation = (server) => {
  return async(request, reply) => {
    await queryIfSame(server, "occupations", "getOccupation", request, reply)
  }
}

const GetOccupationDetail = (server) => {
  return (id, reply) => {
    server.methods.services.occupations.getOccupationDetail(
      id,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}


module.exports = {
  ListOccupation, GetOccupationDetail
}