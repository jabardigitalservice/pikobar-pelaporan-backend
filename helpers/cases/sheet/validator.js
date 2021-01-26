const Joi = require('joi')
const helper = require("./handler")
const lang = require('../../dictionary/id.json')
const rules = require('../../../api/v2/cases/validations/input')

const translateLangId = (transformedErrors, errField, errMessage) => {
  if (errMessage.replace && lang[errField]) {
    errMessage = errMessage.replace(errField, lang[errField])
    errField = lang[errField]
  }

  if (!Array.isArray(transformedErrors[errField])) {
    transformedErrors[errField] = []
  }

  if (!transformedErrors[errField].includes(errMessage)) {
    transformedErrors[errField].push(errMessage)
  }

  return transformedErrors
}

const transformedJoiErrors = (joiResult) => {
  if (!joiResult.error) return {}

  let transformedErrors = {}
  const details = joiResult.error.details

  for (let e in details) {
    let errMessage = details[e].message

    let errField = errMessage.substr(
      1, errMessage.lastIndexOf('"')-1
    )

    // transform field to idn locale lang
    transformedErrors = translateLangId(
      transformedErrors,
      errField,
      errMessage
    )
  }

  return transformedErrors
}

const concatErrorsOnSpecificFIeld = (fieldErrors, fieldName) => {
  let desc = ''
  if (fieldErrors[fieldName].join) {
    const rawDesc = fieldErrors[fieldName].join(',')
    desc = transformErrorDescription(rawDesc)
  }

  return desc
}

const transformFieldErrors = (errors, index) => {
  const rowErrors = []

  for (let error in errors[index]) {
    const fieldErrors = errors[index][error] || {}

    for (let fieldName in fieldErrors) {
      const desc = concatErrorsOnSpecificFIeld(fieldErrors, fieldName)
      const transformedFieldErrors = {}

      transformedFieldErrors.columnName = fieldName
      transformedFieldErrors.description = desc
      rowErrors.push(transformedFieldErrors)
    }

  }

  return rowErrors
}

const transformedErrorResponse = (errors) => {
  // transform error response
  const transformed = []
  for (let i in errors) {
    const rowErrors = transformFieldErrors(errors, i)

    transformed.push({
      rowNumber: i,
      data: rowErrors,
    })
  }

  return transformed
}

const validateNik = async (recordError, nik) => {
  const nikExists = await helper.isNikExists(nik)

  if (nik && nikExists) {
    const errField = lang['nik']
    const message = 'Sudah terdata di laporan kasus!'
    if (!Array.isArray(recordError[errField])) {
      recordError[errField] = []
    }
    recordError[errField].push(`\"${errField}"\ '${nik}' ${message}`)
  }

  return recordError
}

const validateDuplicateNikReqPayload = (recordError, reqDuplicateNik, payload, nik) => {
  const founded = payload.filter(n => n.nik === nik)
  if (nik && founded.length > 1 && !reqDuplicateNik.includes(nik)) {
    const nums = founded.map(x => x.num)

    const errField = lang['nik']
    const message = ` Terdapat duplikasi NIK ${nik} pada baris nomor ${nums.join(',')}`

    if (!Array.isArray(recordError[errField])) {
      recordError[errField] = []
    }

    reqDuplicateNik.push(nik)
    recordError[errField].push(`${message}`)
  }

  return recordError
}

const validateDistrictCode = async (recordError, code) => {
  const isDistrictCodeValid = await helper.isDistrictCodeValid(code)

  if (!isDistrictCodeValid) {
    const errField = lang['address_district_code']
    if (!Array.isArray(recordError[errField])) {
      recordError[errField] = []
    }
    recordError[errField].push(`\"${errField}" Kode Kabupaten Salah.`)
  }

  return recordError
}

const validateFinalResult = (recordError, final_result) => {
  const errField = lang['final_result']
  const message = `Kriteria dengan nama ${final_result} tidak sesuai dengan ketentuan, harap diperbaiki terlebih dahulu sesuai ketentuan`
  if (!Array.isArray(recordError[errField])) {
    recordError[errField] = []
  }
  recordError[errField].push(`\"${errField}"\ '${final_result}' ${message}`)

  return recordError
}

const validate = async (payload) => {
  const errors = {}
  const reqDuplicateNik = []

  for (let i = 0; i < payload.length; i++) {
    const joiResult = Joi.validate(payload[i], rules.CaseSheetRequest)

    const recordErrors = []
    const { nik, address_district_code, final_result } = payload[i]
    let recordError = transformedJoiErrors(joiResult)

    // is address_district_code exist?
    recordError = await validateDistrictCode(recordError, address_district_code)

    // Validate duplication NIK on database
    recordError = await validateNik(recordError, nik)

    // validate duplication NIK on request payload
    recordError = validateDuplicateNikReqPayload(recordError, reqDuplicateNik, payload, nik)

    // validate final result request payload
    recordError = validateFinalResult(recordError, final_result)

    if (Object.keys(recordError).length) {
      recordErrors.push(recordError)
    }

    if (recordErrors.length) {
      const row = (parseInt(i)+1).toString()
      errors[row] = recordErrors
    }
  }

  return transformedErrorResponse(errors)
}

const transformErrorDescription = (desc) => {
  if (!desc || !desc.replace) {
    return desc
  }

  const mapObj = {
    'is required': 'Harus diisi/Belum sesuai',
    'must be a string': 'Harus berisi huruf alfabet',
    'must be a number': 'Harus berisi angka',
    'length must be 16 characters long': 'Harus 16 digit',
  }

  const expression = [
    'is required',
    '|must be a string',
    '|must be a number',
    '|length must be 16 characters long',
  ].join('')

  const result = desc.replace(new RegExp(expression, 'gi'), (matched) => {
    return mapObj[matched]
  })

  return result
}

module.exports = {
  validate,
}
