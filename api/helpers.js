// --------------------------------------------------
//    Custom Error
// --------------------------------------------------

function CommentReferenceError (message) {
    this.name = 'CommentReferenceError'
    this.message = message || 'This comment does not belong to the survey !'
    this.stack = (new Error()).stack
  }

  CommentReferenceError.prototype = Object.create(Error.prototype)
  CommentReferenceError.prototype.constructor = CommentReferenceError

  // --------------------------------------------------
  //    Helpers
  // --------------------------------------------------

  function joiResponseErrorHandler (err) {
    if (err.isJoi) {
      let response ={
        status: 422,
        message: {},
        data: null
      }

      err.details.forEach((error) => {
        response.message = error.message
      })

      return response
    }

    return null
  }

  function defaultResponseErrorHandler (err) {
    let response ={
      status: 422,
      message: {},
      data: null
    }

    response.message = err.message

    return response
  }

  function mongooseResponseValidationErrorHandler (err) {
    if (err.name && err.name === 'ValidationError') {
      let response ={
          status: 422,
          message:{},
          data: null
      }

      var keys = Object.keys(err.errors)
      for (var index in keys) {
        var key = keys[index]
        if (err.errors[key].hasOwnProperty('message')) {
          response.message = key +' '+err.errors[key].value +' '+ err.errors[key].message
        }
      }

      return response
    }

    return null
  }

  const errorHandlers = [joiResponseErrorHandler, mongooseResponseValidationErrorHandler, defaultResponseErrorHandler]

  const constructErrorResponse = (err) => {
    var response
    for (var handler in errorHandlers) {

      let handlerFn = errorHandlers[handler]

      if (typeof (handlerFn) === 'function') {
        response = handlerFn(err)
        if (response !== null) break
      }
    }

    return response
  }

  const successResponse = (result) => {
    let jsonOutput = {
      status: 200,
      message: "Success",
      data: result
    }
    return jsonOutput
  }

  const replyJson = (err, result, request, reply) => {
    if (err) return reply(constructErrorResponse(err)).code(422)
    return reply(
      successResponse(result, request)
    ).code(200)
  }

  module.exports = {
    constructErrorResponse,
    CommentReferenceError,
    successResponse,
    replyJson
  }
