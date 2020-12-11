const {
  PATIENT_STATUS, CRITERIA, ANSWER,
  PYSICHAL, INCOME, DIAGNOSIS,
  DISEASES
} = require('./constant');
const setPwd = (payload) => {
  const crypto = require('crypto');
  payload.salt = crypto.randomBytes(16).toString('hex');
  payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex');
  payload.password = payload.hash;
  return payload;
}

const deletedSave = (payloads, author) => {
  const date = new Date();
  payloads.delete_status = "deleted";
  payloads.deletedAt = date.toISOString();
  payloads.deletedBy = author;
  return payloads;
}

const isObject = (value) => {
  return value && typeof value === 'object'
}

const deleteProps = (arrProps, obj) => {
  if (!isObject(obj) || !Array.isArray(arrProps)) return
  arrProps.map(x => delete obj[x])
}

const jsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return false
  }
}

const convertDate = (dates) => {
  const moment = require('moment')
  return moment(dates).format('YYYY/MM/DD')
}

function isEqual(a, b) {
  if (Array.isArray(a))
    return JSON.stringify(a) === JSON.stringify(b)
  else if (typeof (a) === 'object')
    return String(a) === String(b)
  return a === b
}

const isDirty = (oldData, newData) => {
  if (!oldData) {
    return true
  }

  let result = false
  let changed_props = [];
  for (let prop in newData) {
    if (typeof oldData[prop] === 'undefined') continue
    if (!isEqual(oldData[prop], newData[prop])) {
      result = true
      changed_props.push(prop)
    }
  }

  return result
}

const patientStatus = (params) => {
  let finalResult
  switch (params) {
    case '1':
      finalResult = PATIENT_STATUS.DONE
      break
    case '2':
      finalResult = PATIENT_STATUS.DEAD
      break
    case '3':
      finalResult = PATIENT_STATUS.DISCARDED
      break
    case '4':
      finalResult = PATIENT_STATUS.SICK
      break
    case '5':
      finalResult = PATIENT_STATUS.QUARANTINED
      break
    default:
      finalResult = PATIENT_STATUS.NEGATIVE
  }

  return finalResult
}

const criteriaConvert = (status) => {
  let criteria
  switch (status) {
    case CRITERIA.CONF:
      criteria =CRITERIA.CONF_ID
      break
    case CRITERIA.PROB:
      criteria = CRITERIA.PROB_ID
      break
    case CRITERIA.SUS:
      criteria = CRITERIA.SUS_ID
      break
    case CRITERIA.CLOSE:
      criteria = CRITERIA.CLOSE_ID
      break
    default:
      criteria = ''
  }

  return criteria
}

const convertYesOrNO = (param) => {
  let result
  switch (param) {
    case 1:
      result = ANSWER.YA
      break
    case 2:
      result = ANSWER.TIDAK
      break
    case 3:
      result = ANSWER.TIDAK_TAHU
      break
    default:
      result = ''
  }

  return result
}

const yesOrNoBool = (param) => {
  let result
  if (param) {
    result = ANSWER.YA
  } else {
    result = ANSWER.TIDAK
  }

  return result
}

const convertIncome = (param) => {
  let result
  switch (param) {
    case 0:
      result = INCOME.NO_INCONME
      break
    case 1:
      result = INCOME.SMALLER
      break
    case 2:
      result = INCOME.ONE_TO3
      break
    case 3:
      result = INCOME.THREET_O5
      break
    case 4:
      result = INCOME.GREATHER_5
      break
    default:
      result = ''
  }

  return result
}

const convertPysichal = (param) => {
  let result
  switch (param) {
    case 0: result = PYSICHAL.SEDENTER; break
    case 1: result = PYSICHAL.SMALLER_150MINUTE; break
    case 2: result = PYSICHAL.GREATHER_150MINUTE; break
    default: result = ''
  }

  return result
}

const checkExistColumn = (param) => {
  return param ? param : ""
}

const rollback = async (schema, insertedIds) => {
  const ids = insertedIds.map(c => c._id)
  if (!ids.length) return;
  return await schema.deleteMany({
    _id: { $in: ids }
  })
}

const checkDiagnosis = (data) => {
  return {
    "Demam" : yesOrNoBool(data.includes(DIAGNOSIS.FEVER)),
    "Batuk": yesOrNoBool(data.includes(DIAGNOSIS.COUGH)),
    "Pilek": yesOrNoBool(data.includes(DIAGNOSIS.FLU)),
    "Sakit Tenggorokan": yesOrNoBool(data.includes(DIAGNOSIS.SORE_THROAT)),
    "Sakit Kepala": yesOrNoBool(data.includes(DIAGNOSIS.HEADACHE)),
    "Sesak Napas": yesOrNoBool(data.includes(DIAGNOSIS.BLOWN)),
    "Menggigil": yesOrNoBool(data.includes(DIAGNOSIS.SHIVER)),
    "Lemah (malaise)": yesOrNoBool(data.includes(DIAGNOSIS.WEAK)),
    "Nyeri Otot": yesOrNoBool(data.includes(DIAGNOSIS.MUSCLE_ACHE)),
    "Mual atau Muntah": yesOrNoBool(data.includes(DIAGNOSIS.NAUSEA)),
    "Nyeri Abdomen": yesOrNoBool(data.includes(DIAGNOSIS.ABDOMENT_PAIN)),
    "Diare": yesOrNoBool(data.includes(DIAGNOSIS.DIARRHEA))
  }
}

const checkDiseases = (data) => {
  return {
    "Hamil" : yesOrNoBool(data.includes(DISEASES.PREGNANT)),
    "Diabetes": yesOrNoBool(data.includes(DISEASES.DIABETES)),
    "Penyakit Jantung": yesOrNoBool(data.includes(DISEASES.HEART_DISEASE)),
    "Hipertensi": yesOrNoBool(data.includes(DISEASES.HYPERTENSION)),
    "Keganasan": yesOrNoBool(data.includes(DISEASES.MALIGNANCY)),
    "Gangguan Imunologi": yesOrNoBool(data.includes(DISEASES.IMMUNOLOGICAL_DISORDERS)),
    "Gagal Ginjal Kronis": yesOrNoBool(data.includes(DISEASES.CHRONIC_KIDNEY_FAILURE)),
    "Gagal Hati Kronis": yesOrNoBool(data.includes(DISEASES.CHRONIC_HEART_FAILURE)),
    "PPOK": yesOrNoBool(data.includes(DISEASES.PPOK))
  }
}

const locationPatient = (location, location_name) => {
  let result = {}
  if(location === "RS"){
    result.bool = ANSWER.YA
    result.location_name = location_name
  }else{
    result.bool = ANSWER.TIDAK
    result.location_name = ""
  }
  return result
}

const dateReplace = (date) => {
  const searchRegExp = new RegExp('/', 'g')
  const queryDate = date
  const searchDate = queryDate.replace(searchRegExp, '-')
  return searchDate
}

module.exports = {
  setPwd, deletedSave, isObject, deleteProps, jsonParse,
  convertDate, isDirty, patientStatus, criteriaConvert, convertYesOrNO,
  convertIncome, convertPysichal, checkDiagnosis,
  checkDiseases, checkExistColumn, rollback, locationPatient, yesOrNoBool,
  dateReplace
}
