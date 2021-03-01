const replyHelper = require('../helpers')
const caseTransferHelper = require('../../helpers/casetransferhelper')

const CheckCredentialUnitIsExist = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            if (user.unit_id) {
                return reply()
            } else {
                return reply({
                    status: 422,
                    message: 'Anda tidak memiliki akses unit, silahkah edit profil user unit!',
                    data: null
                }).code(422).takeover()
            }
        },
        assign: 'check_credential_unit_is_exist'
    }
}

const getTransferCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.transferId
             server.methods.services.casesTransfers.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                 return reply(item)
             })
        },
        assign: 'transfer_case'
    }
}

const CheckCaseIsAllowToTransfer = server => {
    return {
        method: (request, reply) => {
            const currentCase = request.preResponses.cases.source
            const userUnit = request.auth.credentials.user.unit_id
            const destinationUnit = request.payload.transfer_to_unit_id

            const params = {
                transfer_case_id: request.params.id,
            }

            const response = (code, messg) => {
                return reply({
                    status: code,
                    message: messg,
                    data: null
                }).code(code).takeover()
            }

            if (destinationUnit.toString() === userUnit._id.toString()) {
                return response(422, 'Cannot transfer to your own unit!')
            }

            if (currentCase.verified_status !== 'verified') {
                return response(422, 'Data Kasus belum terverifikasi oleh Dinkes!')
            }

            server.methods.services.casesTransfers.getLastTransferCase(params, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()

                if (!result || !['pending', 'declined'].includes(result.transfer_status)) return reply(result)                

                const msg = "Rujukan sudah ada dan sedang menunggu persetujuan dari " + result.transfer_to_unit_name
                return response(422, msg)
            })
        },
        assign: 'is_case_allow_to_transfer'
    }
}

const CheckIsTransferActionIsAllow = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            const params = {
                transfer_case_id: request.params.id,
            }
            server.methods.services.casesTransfers.getLastTransferCase(params, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                
                let action = 'revise'
                if (request.params.action === 'approve') action = 'approved'
                else if (request.params.action === 'decline') action = 'declined'
                else if (request.params.action === 'abort') action = 'aborted'

                const errors = caseTransferHelper.canAction(request, result, action, user)
                if (!errors) return reply()

                return reply({
                    status: 422,
                    message: errors
                }).code(422).takeover()
            })
        },
        assign: 'is_case_allow_to_action'
    }
}

module.exports ={
    getTransferCasebyId,
    CheckCaseIsAllowToTransfer,
    CheckIsTransferActionIsAllow,
    CheckCredentialUnitIsExist,
}
