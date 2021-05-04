const { constructErrorResponse, replyJson } = require('../helpers')
const { VERIFIED_STATUS } = require('../../helpers/constant')
function constructCasesResponse(cases) {
  let jsonCases = {
    status: 200,
    message: "Success",
    data: cases
  }
  return jsonCases
}

module.exports = (server) => {
  return {
    /**
     * GET /api/cases-transfer
     * @param {*} request
     * @param {*} reply
     */
    async ListCaseTransfer(request, reply) {
      let query = request.query
      let type = request.params.type

      server.methods.services.casesTransfers.list(
        query,
        request.auth.credentials.user,
        type,
        (err, result) => replyJson(err, result, reply)
      )
    },
    /**
     * POST /api/cases-transfer
     * @param {*} request
     * @param {*} reply
     */
    CreateCaseAndTransfer(request, reply) {
      let payload = request.payload
      let author = request.auth.credentials.user
      server.methods.services.cases.create(
        payload,
        author,
        request.pre,
        async (err, resultCase) => {
          if (err) return reply(constructErrorResponse(err)).code(422)

          server.methods.services.casesTransfers.processTransfer(
            request.params.transferId,
            resultCase._id,
            'pending',
            request.auth.credentials.user,
            request.payload,
            (err, result) => {
              const data = {
                ...result._doc,
                case: resultCase
              }
              replyJson(err, data, reply)
            })
        })
    },
    /**
     * PUT /api/cases-transfer/{id}
     * @param {*} request
     * @param {*} reply
     */
    async UpdateCaseAndTransfer(request, reply) {
      let pre = request.pre
      let payload = request.payload
      let id = request.params.id
      let author = request.auth.credentials.user
      server.methods.services.cases.update(id, pre, author, payload,
        async (err, resultCase) => {
          if (err) return reply(constructErrorResponse(err)).code(422)
          server.methods.services.histories.createIfChanged(Object.assign(payload, { case: id }),
            (err, result) => {
              if (err) return reply(constructErrorResponse(err)).code(422)
              server.methods.services.casesTransfers.processTransfer(
                request.params.transferId,
                pre.transfer_case.transfer_case_id,
                'pending',
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                  const data = {
                    ...result._doc,
                    case: resultCase
                  }
                  replyJson(err, data, reply)
                })
            })
        })
    },
    /**
     * GET /api/cases/{id}/transfers
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseTransfers(request, reply) {
      server.methods.services.casesTransfers.get(
        request.params.id,
        (err, result) => replyJson(err, result, reply)
      )
    },
    /**
     * PUT /api/cases/{id}/transfers
     * @param {*} request
     * @param {*} reply
     */
    async CreateCaseTransfer(request, reply) {
      let payload = request.payload
      let id = request.params.id
      let author = request.auth.credentials.user

      server.methods.services.casesTransfers.create(
        id,
        author,
        request.pre,
        payload,
        (err, result) => replyJson(err, result, reply)
      )
    },
    /**
     * POST /api/cases/{id}/transfers
     * @param {*} request
     * @param {*} reply
     */
    async ProcessCaseTransfer(request, reply) {
      server.methods.services.casesTransfers.processTransfer(
        request.params.transferId,
        request.pre.transfer_case.transfer_case_id,
        request.params.action,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(constructErrorResponse(err)).code(422)

          if (request.params.action === VERIFIED_STATUS.APPROVED) {
            const { _id, ...historyPayload } = result.transfer_last_history.toObject()
            let historiesPayload = Object.assign(historyPayload, {
              current_location_type: 'RS',
              current_location_address: result.transfer_to_unit_name,
              hospital_id: result.transfer_to_unit_id
            })

            server.methods.services.histories.createIfChanged(
              historiesPayload,
              (err, resultHistory) => resultHistory)
          }

          return reply(
            constructCasesResponse(result, request)
          ).code(200)
        })
    },
    /**
     * GET /api/cases/summary-transfers
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseSummaryTransfer(request, reply) {
      server.methods.services.casesTransfers.geTransferCaseSummary(
        request.params.type,
        request.auth.credentials.user,
        (err, item) => replyJson(err, item, reply)
        )
    },
  }
}
