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

const updateIfSame = async (server, request, param, reply, name, replyJson) => {
  server.methods.services[name].update(
    request.params[param],
    request.payload,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcIfSame = async (server, request, param, reply, name, methods, replyJson) => {
  server.methods.services[name][methods](
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

module.exports = { createIfSame, updateIfSame, funcIfSame }

