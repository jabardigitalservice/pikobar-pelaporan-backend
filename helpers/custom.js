'use strict'
const { PATIENT_STATUS, CRITERIA } = require('./constant')
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
    return new Date(dates.getTime()).toLocaleDateString("id-ID");
}

const isDirty = (oldData, newData) => {
    if (!oldData) {
        return true
    }

    function isEqual (a, b) {
        if (Array.isArray(a))
            return JSON.stringify(a) === JSON.stringify(b)
        else if (typeof(a) === 'object')
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

const criteriaConvert = (res) => {
  let criteria
  if (res.status === CRITERIA.CONF) {
    criteria = 'Konfirmasi'
  } else if (res.status === CRITERIA.PROB) {
    criteria = 'Probable'
  } else if (res.status === CRITERIA.SUS) {
    criteria = 'Suspek'
  } else if (res.status === CRITERIA.CLOSE) {
    criteria = 'Kontak Erat'
  } else {
    criteria = ''
  }

  return criteria
}

const convertYesOrNO = (param) => {
  let result
  if (param === 1) {
    result = 'Ya'
  } else if (param === 2) {
    result = 'Tidak'
  } else if (param === 3) {
    result = 'Tidak Tahu'
  } else {
    result = ''
  }

  return result
}

const convertIncome = (param) => {
  let result
  if (param === 0) {
    result = 'Tidak ber penghasilan'
  } else if (param === 1) {
    result = '< 1juta'
  } else if (param === 2) {
    result = '1 s/d 3 juta'
  } else if (param === 3) {
    result = '3 s/d 5 juta'
  } else if (param === 4) {
    result = '> 5juta'
  } else {
    result = ''
  }

  return result
}

const convertPysichal = (param) => {
  let result
  if (param === 0) {
    result = 'Sedenter'
  } else if (param === 1) {
    result = 'Latihan fisik < 150 menit'
  } else if (param === 2) {
    result = 'Latihan fisik > 150 menit'
  } else {
    result = ''
  }

  return result
}

module.exports = {
  setPwd, deletedSave, isObject, deleteProps, jsonParse,
  convertDate, isDirty, patientStatus, criteriaConvert, convertYesOrNO,
  convertIncome, convertPysichal
}
