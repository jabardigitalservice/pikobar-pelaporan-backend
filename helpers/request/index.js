const funcIfSame = async (server, name, methods, request, param, reply, replyJson) => {
  server.methods.services[name][methods](
    request.params[param],
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const queryIfSame = async (server, name, methods, request, reply, replyJson) => {
  server.methods.services[name][methods](
    request.query,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const queryParamSame = async (server, name, methods, request, param, reply, replyJson) => {
  server.methods.services[name][methods](
    request.params[param],
    request.query,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcNoParam = async (server, name, methods, reply, replyJson) => {
  server.methods.services[name][methods](
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

const funcCreate = async (server, name, methods, request, reply, replyJson) => {
  server.methods.services[name][methods](
    request,
    (err, result) => {
      replyJson(err, result, reply)
    }
  )
}

module.exports = {
  funcIfSame, queryIfSame, queryParamSame, funcNoParam,
  funcCreate
}

