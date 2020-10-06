const replyHelper = require('../helpers')
const { replyJson } = require('../helpers')

/**
 * GET /api/cases/{caseId}/closecontact
 */
const ListClosecontactCase = (server) => {
  return (request, reply) => {
    server.methods.services.cases.closecontact.getByCase(
      request.pre.cases,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * POST /api/cases/{caseId}/closecontact
 */
const CreateClosecontact = (server) => {
  return (request, reply) => {
    server.methods.services.cases.closecontact.create(
      server.methods.services,
      request.pre,
      request.auth.credentials.user,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * PUT /api/cases/{caseId}/closecontact
 */
const updateClosecontact = (server) => {
  return (request, reply) => {
    const { payload, pre } = request
    const { caseId } = request.params
    server.methods.services.cases.update(
      caseId,
      pre,
      request.auth.credentials.user,
      payload,
      (_err, _result) => {
        if (_err) return reply(replyHelper.constructErrorResponse(_err)).code(422)
        server.methods.services.histories.createIfChanged(
          { ...payload, case: caseId },
          (err, result) => {
            replyJson(err, result, reply)
        })
      }
    )
  }
}

/**
 * GET api/cases/{caseId}/closecontact/{contactCaseId}
 */
const DetailClosecontact = (server) => {
  return (request, reply) => {
    server.methods.services.cases.closecontact.detailCaseContact(
      request.pre.cases,
      request.pre.contactCase,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * PUT api/cases/{caseId}/closecontact/{contactCaseId}
 */
const UpdateClosecontact = (server) => {
  return (request, reply) => {
    server.methods.services.cases.closecontact.updateCaseContact(
      request.pre.cases,
      request.pre.contactCase,
      request.payload,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * DELETE api/cases/{caseId}/closecontact/{contactCaseId}
 */
const DeleteClosecontact = (server) => {
  return (request, reply) => {
    const { cases, contactCase } = request.pre
    server.methods.services.cases.closecontact.pullCaseContact(
      cases, contactCase,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  ListClosecontactCase,
  CreateClosecontact,
  updateClosecontact,
  DetailClosecontact,
  UpdateClosecontact,
  DeleteClosecontact,
}
