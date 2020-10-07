const { replyJson } = require('../helpers')
const createInspectionSupport = (server) => {
  return (request, reply) => {
    server.methods.services.inspection_support.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const getInspectionSupport = (server) => {
  return (request, reply) => {
    const { id_case } = request.params
    server.methods.services.inspection_support.read(
      id_case,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const updateInspectionSupport = (server) => {
  return (request, reply) => {
    const { id_inspection_support } = request.params
    server.methods.services.inspection_support.update(
      id_inspection_support,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

const deleteInspectionSupport = (server) => {
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