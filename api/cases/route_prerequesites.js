const replyHelper = require('../helpers')
const { conditionPreReq } = require('../../utils/conditional')

const sameRequest = (server, request, reply, name) => {
  if (request.route.method === 'put' && request.route.path === '/api/cases/{id}') {
    if (!request.payload.address_district_code) return reply(false)
  }

  server.methods.services.cases[name](
    request.payload.address_district_code,
    (err, count) => replyHelper.replyOnly(err, count, reply)
  )
}
const validationBeforeInput = server => {
    return {
        method: (request, reply) => {
            if (request.payload.address_district_code === request.auth.credentials.user.code_district_city) {
                return reply(request.auth.credentials.user.code_district_city)
            } else {
                return reply({
                    status: 422,
                    message: 'Anda tidak dapat melakukan input kasus di luar wilayah anda.!',
                    data: null
                }).code(422).takeover()
            }
        },
        assign: 'validation_before_input'
    }
}

const checkCaseIsExists = server => {
    return {
        method: (request, reply) => {
            let skip = false
            const nik = request.payload.nik
            if(!nik) return reply()
            server.methods.services.cases.getByNik(nik, (err, result) => {
                if (request.route.method === 'put') {
                  const thisCase = request.preResponses.cases.source
                  if (nik === thisCase.nik || !result) { skip = true }
                } else if (!result) { skip = true }

                if (skip) return reply(result)

                let author = result.author ? result.author.fullname : null
                let message = `NIK ${nik} atas nama ${result.name} `

                if (result.transfer_to_unit_name && result.transfer_status !== 'approved' ) {
                    message += `Sedang dalam proses rujukan ke ${result.transfer_to_unit_name}`
                } else if (result.transfer_to_unit_name && result.transfer_status === 'approved') {
                    message += `Sudah terdata di laporan kasus ${result.transfer_to_unit_name}`
                } else { message += `Sudah terdata di laporan kasus ${author}` }

                return reply({status: 422, message: message, data: 'nik_exists'})
                  .code(422).takeover()
            })
       }, assign: 'case_exist',
    }
}

const countCaseByDistrict = server =>{
  return {
    method: (request, reply) => {
      sameRequest(server, request, reply, 'getCountByDistrict')
    }, assign: 'count_case'
  }
}

const countCasePendingByDistrict = server =>{
  return {
    method: (request, reply) => {
      sameRequest(server, request, reply, 'getCountPendingByDistrict')
    },assign: 'count_case_pending'
  }
}

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.id
             server.methods.services.cases.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()

                 if (!item) {
                    return reply({
                        status: 404,
                        message: 'Data Kasus tidak ditemukan!',
                        data: null
                    }).code(404).takeover()
                 }

                 return reply(item)
             })
        },
        assign: 'cases'
    }
}

const checkCaseIsAllowToDelete = server => {
    return {
        method: (request, reply) => {
            let user = request.auth.credentials.user
            let currentCase = request.preResponses.cases.source
            if (user.role === 'faskes' && currentCase.verified_status === 'verified') {
                return reply({
                    status: 422,
                    message: 'Data terverifikasi tidak dapat dihapus!',
                    data: null
                }).code(422).takeover()
             }
            return reply(true)
        },
        assign: 'is_delete_allow'
    }
}

const checkIfDataNotNull = server =>{
     return {
         method: (request, reply) => {
            let query = request.query
            let user = request.auth.credentials.user
            const message = `Data untuk ${user.fullname} belum ada.`

             server.methods.services.cases.list(
                query, user,
                (err, result) => { conditionPreReq(result, 'cases', reply, message) }
              )
         },
         assign: 'check_cases'
     }
}

const getDetailCase = server => {
  return {
    method: (request, reply) => {
      const id = request.params.id
      server.methods.services.cases.getById(id, async (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
        if (result.verified_status === 'verified') {
          return reply({
            status: 422,
            message: 'Case already verified!',
            data: null
          }).code(422).takeover()
        }

        server.methods.services.cases.getCountByDistrict(
          result.address_district_code,
          async (err, count) => {
            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
            return reply(Object.assign(result, count))
          })
        })
      },
      assign: 'count_case'
    }
}

module.exports ={
    countCaseByDistrict,
    countCasePendingByDistrict,
    getCasebyId,
    checkIfDataNotNull,
    validationBeforeInput,
    checkCaseIsExists,
    getDetailCase,
    checkCaseIsAllowToDelete,
}
