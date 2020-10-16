const { replyJson } = require('../helpers');

/**
* /api/unit
* @param {*} request
* @param {*} reply
*/
function createUnit(server) {
  return async (request, reply) => {
    await server.methods.services.unit.create(
      request.payload,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

function getUnit(server) {
  return async (request, reply) => {
    await server.methods.services.unit.read(
      request.query,
      (err, result) => {
      replyJson(err, result, reply)
    })
  }
}

function updateUnit(server) {
  return async (request, reply) => {
    await server.methods.services.unit.update(
      request.payload, request.params.id,
      "update", request.auth.credentials.user._id,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

function deleteUnit(server) {
  return async (request, reply) => {
    await server.methods.services.unit.update(
      request.payload,
      request.params.id,
      "delete", request.auth.credentials.user._id,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

function listUnitById(server) {
  return async (request, reply) => {
    await server.methods.services.unit.readbyid(
      request.params.id,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  createUnit, getUnit, updateUnit,
  listUnitById, deleteUnit
}