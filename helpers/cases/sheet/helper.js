const config = require('./config.json')
const lang = require('../../dictionary/id.json')
const helpers = {}

helpers._toString = (value) => {
  if (value === '-') return null
  if (value && value.toString) return value.toString().trim()
  return value
}
helpers._toDateString = (value) => {
  if (!value) return null
  return new Date((value - (25567 + 2))*86400*1000) || null
}
helpers._toUnsignedInt = (value) => {
  if (value && value.parseToInt) return Math.abs(value.parseToInt())
  else if (value && typeof value === 'number') return Math.abs(value)
  return value
}

helpers.getStringValueByIndex = (value, index) => {
  if (!value) return null
  return helpers._toString(value.split('-')[index] || null)
}

helpers.requestFileError = (payload) => {
  let error = false
  const useTemplateVersioning = false

  if (payload === config.unverified_template && useTemplateVersioning) {
    error = lang.messages.unverified_template
  } else if (payload === config.version_out_of_date && useTemplateVersioning) {
    error = lang.messages.version_out_of_date
  }else if (payload.length > config.max_rows_allowed) {
    error = `Maksimal import kasus adalah ${config.max_rows_allowed} baris`
  } else if (!payload.length) {
    error = lang.messages.empty_data
  }

  return error
}

/**
* compare data in 1 millisecond
* if different means the case is in the process of insertion by another process
* to remember, this is only a temporary method to prevent :)
*/
helpers.isAnotherImportProcessIsRunning = async (schema) => {
  const delay = (t) => {
    return new Promise(resolve => setTimeout(resolve.bind(), t))
  }

  const totalOne = await schema.find().countDocuments()
  promise = delay(100)
  const totalTwo = await schema.find().countDocuments()
  if (totalOne !== totalTwo) return true;

  return false
}

helpers.isTemplateVerified = (dataSheet) => {

  const verfiedTemplate = config.verified_template
  if (dataSheet[1][34] !== verfiedTemplate
    || dataSheet[2][34] !== verfiedTemplate
    || dataSheet[3][34] !== verfiedTemplate
    || dataSheet[4][34] !== verfiedTemplate ) {
    return false
  }

  return true
}

helpers.getTransformedAge = (age) => {
  if (age < 0) return undefined
  const a = helpers._toUnsignedInt(age) || 0
  return helpers._toString(a)
}

helpers.getArrayValues = (reference, cellString) => {
  const unknown = [], registered = []
  const cellArray = cellString ? cellString.trim().split(',') : []

  for (let i = 0; i < cellArray.length; i++) {
      const val = helpers._toString(cellArray[i]).trim().toLowerCase()
      const founded = reference.find(v => v.toLowerCase() === val)

      if (founded) registered.push(founded)
      else unknown.push(val)
  }

  return { registered, unknown }
}

helpers.getUnknownValuesOfArray = (cellValue, unknownArrs) => {
  let value = helpers._toString(cellValue)
  if (!unknownArrs.join) return null

  if (value) {
    value += ' ' + unknownArrs.join(',')
  } else {
    value = unknownArrs.join(',')
  }

  return value
}

helpers.yesNoUnknown = (value) => {
  let res = 3

  if (value) {
    value = value.toLowerCase()
  }

  switch (value) {
    case 'ya': res = 1; break;
    case 'tidak': res = 2; break;
    default: res = 3;
  }

  return res
}

helpers.trueOrFalse = (v) => {
  if (!v) return
  if (v.toLowerCase) { v = v.toLowerCase() }
  return v === 'ya memiliki'
}

helpers._toLowerCaseTrim = (v) => {
  let res = helpers._toString(v)
  if (res) { res = res.trim().toLowerCase() }
  return res
}

helpers.findReference = (ref, v) => {
  const find = ref.find(r => r.text === helpers._toLowerCaseTrim(v))

  if (find) {
    return find.value
  }

  return null
}

module.exports = helpers
