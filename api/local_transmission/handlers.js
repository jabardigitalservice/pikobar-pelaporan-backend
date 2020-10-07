const { replyJson } = require('../helpers')
/**
 * /api/local-transmission
 * @param {*} request
 * @param {*} reply
*/
const createLocalTransmission = (server) => {
  return (request, reply) => {
    server.methods.services.local_transmission.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const getLocalTransmission = (server) => {
  return (request, reply) => {
    const { id_case } = request.params
    server.methods.services.local_transmission.read(
      id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const updateLocalTransmission = (server) => {
  return (request, reply) => {
    const { id_local_transmission } = request.params
    server.methods.services.local_transmission.update(
      id_local_transmission,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const deleteLocalTransmission = (server) => {
  return (request, reply) => {
    server.methods.services.local_transmission.delete(
      request.params.id_local_transmission,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}
module.exports = {
  getLocalTransmission,
  updateLocalTransmission,
  createLocalTransmission,
  deleteLocalTransmission
}