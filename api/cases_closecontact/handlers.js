const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructCloseContactResponse(closecontact) {
    let closecontactResponse = {
      status : 200,
      message: true,
      data : closecontact,
    }
    return closecontactResponse
  }

  return {
    // V2
    /**
     * GET /api/cases/{caseId}/closecontact
     * @param {*} request
     * @param {*} reply
     */
    async ListClosecontactCase(request, reply) {
      server.methods.services.cases.closecontact.getByCase(
          request.pre.cases,
          (err, result) => {
            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
            return reply(
              constructCloseContactResponse(result,request)
            ).code(200)
          })
    },
    /**
     * POST /api/cases/{caseId}/closecontact
     * @param {*} request
     * @param {*} reply
     */
    async CreateClosecontact(request, reply) {
      server.methods.services.cases.closecontact.create(
        server.methods.services,
        request.pre,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          return reply(
            constructCloseContactResponse(result, request)
          ).code(200)
        })
    },
    /**
     * PUT /api/cases/{caseId}/closecontact
     * @param {*} request
     * @param {*} reply
     */
    async updateClosecontact(request, reply) {
      const pre = request.pre
      const id = request.params.caseId
      const payload = request.payload
      const author = request.auth.credentials.user

      server.methods.services.cases.update(id, pre, author, payload, (errCase, resultCase) => {
        if (errCase) return reply(replyHelper.constructErrorResponse(errCase)).code(422)

        server.methods.services.histories.createIfChanged(
          Object.assign(payload, {case: id}),
          (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

          return reply(
            constructCloseContactResponse(result, request)
          ).code(200)
        })
      })
    },
    /**
     * DELETE api/cases/{caseId}/closecontact/{contactCaseId}
     * @param {*} request
     * @param {*} reply
     */
    async DeleteClosecontact(request, reply) {
      server.methods.services.cases.closecontact.pullCaseContact(
        request.pre.cases,
        request.pre.contactCase,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            constructCloseContactResponse(result,request)
          ).code(200)
        })
    },
  }
}
