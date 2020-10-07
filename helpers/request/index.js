const headerRequest = (request) => {
  return {
    "query": request.query,
    "user": request.auth.credentials.user,
    "params": request.params,
    "payload": request.payload
  }
}

const createIfSame = async (server, request, param, reply, name, replyJson) => {
  server.methods.services[name].create(
    request.payload,
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const getIfSame = async (server, request, param, reply, name, replyJson) => {
  server.methods.services[name].read(
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const updateIfSame = async (server, request, param, reply, name, replyJson) => {
  server.methods.services[name].update(
    request.params[param],
    request.payload,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const deleteIfSame = async (server, request, param, reply, name, replyJson) => {
  server.methods.services[name].delete(
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

module.exports = { createIfSame, getIfSame, updateIfSame, deleteIfSame }

