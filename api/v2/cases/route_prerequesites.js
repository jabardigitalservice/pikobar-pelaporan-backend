const replyHelper = require('../../helpers')
const {
  validate,
  requestFileError,
  extractSheetToJson,
} = require('../../../helpers/cases/sheet/index')

const {
  isAnotherImportProcessIsRunning,
} = require('../../../helpers/cases/sheet/helper')


const BadRequest = (errors) => {
  return {
    status: 400,
    message: 'Bad request.',
    errors: errors,
  }
}

const countCasesOutsideWestJava = server => {
  return {
    method: (request, reply) => {
      server.methods.services.v2.cases.getCaseCountsOutsideWestJava(
        request.auth.credentials.user.code_district_city,
        (err, res) => {
          if (err) {
            return reply(replyHelper.constructErrorResponse(err))
              .code(422)
              .takeover()
          }
          return reply(res)
        })
    },
    assign: 'case_count_outside_west_java'
  }
}

const sheetToJson = server => {
  return {
    method: async (request, reply) => {
      const payload = await extractSheetToJson(request)

      if (requestFileError(payload)) {
        return reply(BadRequest(requestFileError(payload))).code(400).takeover()
      }

      const errors = await validate(payload)

      if (errors.length) {
        return reply(BadRequest(errors)).code(400).takeover()
      }

      return reply(payload)
    },
    assign: 'sheet_to_json'
  }
}

const isImportBusy = server => {
  return {
    method: async (request, reply) => {
      const res = await isAnotherImportProcessIsRunning(
        require('../../../models/Case')
      )

      if (!res) return reply(res)

      return reply({
        status: 422,
        message: 'Proses import lainnya sedang berjalan, coba beberapa saat lagi!',
        data: null
      }).code(422).takeover()
    },
    assign: 'is_import_busy',
  }
}

module.exports = {
  sheetToJson,
  isImportBusy,
  countCasesOutsideWestJava,
}
