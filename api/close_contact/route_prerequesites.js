const replyHelper = require('../helpers')

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.caseId
             server.methods.services.cases
                .getById(id, (err, result) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    if (!result) {
                        return reply({
                            status: 422,
                            message: 'Invalid case id',
                            data: null
                        }).code(422).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'cases'
    }
}

const getCloseContactbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.closeContactId
             server.methods.services.closeContacts
                .show(id, (err, result) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    if (!result) {
                        return reply({
                            status: 422,
                            message: 'Invalid close contact id',
                            data: null
                        }).code(422).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'close_contact'
    }
}

const districtInputScope = server => {
    return {
        method: (request, reply) => {
            if (request.payload.address_district_code === request.auth.credentials.user.code_district_city) {
                return reply(request.auth.credentials.user.code_district_city)
            } else {
                return reply({
                    status: 422,
                    message: 'Anda tidak dapat melakukan input Kontak Erat di luar wilayah anda.!',
                    data: null
                }).code(422).takeover()
            }
        },
        assign: 'district_input_scope'
    }
}

module.exports = {
    getCasebyId,
    getCloseContactbyId,
    districtInputScope,
}
