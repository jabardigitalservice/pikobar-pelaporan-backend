const {replyHelper, BadRequest} = require('../helpers')
const { conditionPreReq } = require('../../utils/conditional')
const {extractToJson} = require('../../helpers/rdt/sheet')
const {requestFileError, isAnotherImportProcessIsRunning} = require('../../helpers/cases/sheet/helper')
const {validation} = require('../../helpers/rdt/sheet/validation')
const request = require('request')

const validationBeforeInput = server => {
  return {
    method: (request, reply) => {
      const payloadDistrict = request.payload.address_district_code
      const userDistrict = request.auth.credentials.user.code_district_city
      const message = 'Anda tidak dapat melakukan input test di luar wilayah anda.!'
      if (payloadDistrict === userDistrict) {
        return reply(userDistrict)
      } else {
        return reply(replyHelper.customResponse(403, message, null)).code(403).takeover()
      }
    },
    assign: 'validation_before_input'
  }
}

const countRdtCode = server => {
  return {
    method: (request, reply) => {
      const { address_district_code } = request.payload
      methodOneParam(server, 'rdt', 'getCountRdtCode', address_district_code, reply)
    },
    assign: 'count_rdt'
  }
}

const countCaseByDistrict = server => {
  return {
    method: (request, reply) => {
      server.methods.services.rdt.getCountByDistrict(
        request.payload.address_district_code,
        (err, count) => {
          if (err) {
            return reply(replyHelper.constructErrorResponse(err)).takeover()
          }
          return reply(count)
        })
    },
    assign: 'count_case'
  }
}

const getRdtbyId = server => {
  return {
    method: (request, reply) => {
      methodOneParam(server, 'rdt', 'getById', request.params.id, reply)
    },
    assign: 'rdt'
  }
}

const getCasebyIdcase = server => {
  return {
    method: (request, reply) => {
      const idcase = request.pre.rdt.id_case
      methodOneParam(server, 'rdt', 'getCaseByidcase', idcase, reply)
    },
    assign: 'cases'
  }
}

const getCodeDinkes = server => {
  return {
    method: (request, reply) => {
      let code = request.payload.address_district_code
      methodOneParam(server, 'rdt', 'getCodeDinkes', code, reply)
    },
    assign: 'code_dinkes'
  }
}

const checkIfDataNotNull = server => {
  return {
    method: (request, reply) => {
      const fullname = request.auth.credentials.user.fullname
      const message = `Data untuk ${fullname} belum ada.`

      server.methods.services.rdt.list(
        request.query,
        request.auth.credentials.user,
        (err, result) => { conditionPreReq(result, 'rdt', reply, message) }
      )
    },
    assign: 'check_rdt'
  }
}

const getDataExternal = server => {
  return {
    method: (request, reply) => {
      sameMethod(server, 'getDatafromExternal', request, reply)
    },
    assign: 'data_pendaftaran'
  }
}

const searchIdcasefromExternal = server => {
  return {
    method: (request, reply) => {
      sameMethod(server, 'seacrhFromExternal', request, reply)
    },
    assign: 'search_external'
  }
}

const searchIdcasefromInternal = server => {
  return {
    method: (request, reply) => {
      const { query } = request
      methodOneParam(server, 'rdt', 'seacrhFromInternal', query, reply)
    },
    assign: 'search_internal'
  }
}

const getRegisteredUserfromExternal = server => {
  return {
    method: (request, reply) => {
      methodOneParam(server, 'rdt', 'getRegisteredFromExternal', request.query, reply)
    },
    assign: 'reg_user_external'
  }
}

const cekHistoryCases = server => {
  return {
    method: (request, reply) => {
      const payloads = {
        final_result: null,
        status: "POSITIF",
        id_case: request.payload.id_case
      }
      sameCondition(server, 'checkHistoryCasesBeforeInputTest', payloads, request, reply)
    },
    assign: 'cek_history_case'
  }
}


const createHistoryWhenPositif = server => {
  return {
    method: (request, reply) => {
      const payloads = request.pre.cek_history_case
      sameCondition(server, 'createHistoryFromInputTest', payloads, request, reply)
    },
    assign: 'create_history_when_positif'
  }
}

const sameMethod = (server, name, request, reply) => {
  return server.methods.services.rdt[name](
    request.query.address_district_code,
    request.query.search,
    (err, item) => {
      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
      return reply(item)
    })
}

const methodOneParam = (server, service, name, param, reply) => {
  return server.methods.services[service][name](param, (err, item) => {
    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
    return reply(item)
  })
}

const processImport = async (server, request, reply) => {
  const file = await extractToJson(request)
  if (requestFileError(file)) {
      return reply(BadRequest(requestFileError(file))).code(400).takeover()
  }
  const err = await validation(file)
  if (err.length) {
    return reply(BadRequest(err)).code(400).takeover()
  }
  return reply(file)
}

const convertToJson = server => {
  return {
    method: async (request, reply) => {
      processImport(server, request, reply)
    },
    assign: 'convert_to_json'
  }
}

module.exports ={
  countRdtCode,
  getRdtbyId,
  getCodeDinkes,
  checkIfDataNotNull,
  getDataExternal,
  searchIdcasefromInternal,
  searchIdcasefromExternal,
  getRegisteredUserfromExternal,
  cekHistoryCases,
  createHistoryWhenPositif,
  convertToJson,
  // systemBusy
}
