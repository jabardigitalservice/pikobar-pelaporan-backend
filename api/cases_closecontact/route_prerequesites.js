const replyHelper = require('../helpers')

const getById = (server, paramKey, errMsg) => {
  return (request, reply) => {
    const id = request.params[paramKey]
    if (!id) { return reply(true) }
    server.methods.services.cases.getById(id, (err, result) => {
      if (err) {
        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
      }
      if (!result) {
        return reply({
          status: 422,
          message: errMsg,
          data: null,
        }).code(422).takeover()
      }
      return reply(result)
    })
  }
}

const getCasebyId = server => {
  return {
    method: getById(server, 'caseId', 'Invalid case id'),
    assign: 'cases',
  }
}

const getContactCaseById = server => {
  return {
      method: getById(server, 'contactCaseId', 'Invalid contact case id'),
      assign: 'contactCase',
  }
}

const isAccessGranted = server => {
  return {
    method: (request, reply) => {
      let isAccessGranted = false
      const currentCase = request.preResponses.cases.source
      const contactCase = request.preResponses.contactCase.source
      const attrs = [ 'close_contact_parents', 'close_contact_childs' ]

      if (request.route.method !== 'delete') { return reply(true) }

      attrs.forEach(key => {
        if (currentCase[key]) {
          const havingGrantAccess = currentCase[key].find(v => {
            return v.id_case === contactCase.id_case && v.is_access_granted
          })

          if (havingGrantAccess) { isAccessGranted = true }
        }
      })

      if (!isAccessGranted) {
        return reply({
          status: 422,
          message: "this current active case haven't an access to this related case",
        }).code(422).takeover()
      }

      return reply(true)
      },
      assign: 'is_access_granted',
  }
}

module.exports = {
  getCasebyId,
  getContactCaseById,
  isAccessGranted,
}
