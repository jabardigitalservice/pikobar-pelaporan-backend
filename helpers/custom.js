'use strict'
const { PATIENT_STATUS, CRITERIA, ANSWER, PYSICHAL, INCOME } = require('./constant')
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

const isDirty = (oldData, newData) => {
  if (!oldData) {
    return true
  }

  function isEqual(a, b) {
    if (Array.isArray(a))
      return JSON.stringify(a) === JSON.stringify(b)
    else if (typeof (a) === 'object')
      return String(a) === String(b)
    return a === b
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

const patientStatus = (res) => {
  let finalResult
  if (res.final_result === "1") {
    finalResult = PATIENT_STATUS.DONE
  } else if (res.final_result === "2") {
    finalResult = PATIENT_STATUS.DEAD
  } else if (res.final_result === "3") {
    finalResult = PATIENT_STATUS.DISCARDED
  } else if (res.final_result === "4") {
    finalResult = PATIENT_STATUS.SICK
  } else if (res.final_result === "5") {
    finalResult = PATIENT_STATUS.QUARANTINED
  } else {
    finalResult = PATIENT_STATUS.NEGATIVE
  }

  return finalResult
}

const criteriaConvert = (res) => {
  let criteria
  if (res.status === CRITERIA.CONF) {
    criteria = CRITERIA.CONF_ID
  } else if (res.status === CRITERIA.PROB) {
    criteria = CRITERIA.PROB_ID
  } else if (res.status === CRITERIA.SUS) {
    criteria = CRITERIA.SUS_ID
  } else if (res.status === CRITERIA.CLOSE) {
    criteria = CRITERIA.CLOSE_ID
  } else {
    criteria = ''
  }

  return criteria
}

const convertYesOrNO = (param) => {
  let result
  if (param === 1) {
    result = ANSWER.YA
  } else if (param === 2) {
    result = ANSWER.TIDAK
  } else if (param === 3) {
    result = ANSWER.TIDAK_TAHU
  } else {
    result = ''
  }

  return result
}

const convertIncome = (param) => {
  let result
  if (param === 0) {
    result = INCOME.NO_INCONME
  } else if (param === 1) {
    result = INCOME.SMALLER
  } else if (param === 2) {
    result = INCOME.ONE_TO3
  } else if (param === 3) {
    result =INCOME.THREET_O5
  } else if (param === 4) {
    result = INCOME.GREATHER_5
  } else {
    result = ''
  }

  return result
}

const convertPysichal = (param) => {
  let result
  if (param === 0) {
    result = PYSICHAL.SEDENTER
  } else if (param === 1) {
    result = PYSICHAL.SMALLER_150MINUTE
  } else if (param === 2) {
    result = PYSICHAL.GREATHER_150MINUTE
  } else {
    result = ''
  }

  return result
}

const checkExistColumn = (param) => {
  return param ? param : null
}

const rollback = async (schema, insertedIds) => {
  const ids = insertedIds.map(c => c._id)
  return await schema.deleteMany({
    _id: { $in: ids }
  })
}

module.exports = {
  setPwd, deletedSave, isObject, deleteProps, jsonParse,
  convertDate, isDirty, patientStatus, criteriaConvert, convertYesOrNO,
  convertIncome, convertPysichal, checkExistColumn, rollback
}
