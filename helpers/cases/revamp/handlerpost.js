'use strict';
const { CASE, ROLE } = require('../../constant');
const moment = require('moment');
const validatePost = (raw_payload) => {
    if (raw_payload.current_hospital_id === '') {
        raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date === '') {
        raw_payload.first_symptom_date = Date.now();
    }

    return raw_payload;
};

let dates = moment(new Date()).format('YY')
let id_case
let count = ''
let pad = ''
let isWestJava = true

const generateIdCase = (author, pre, req = null) => {
  let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
  let dinkesCode = pre.count_case.dinkes_code;
  if (req && [true, false].includes(req.is_west_java)) {
    isWestJava = req.is_west_java
  }
  if (!isWestJava) {
    const {
      idPusat,
      districtCode,
      count_pasien,
    } = pre.case_count_outside_west_java
    count = count_pasien
    pad = count.toString().padStart(7, '0')
    id_case = `${CASE.CODE}${idPusat}${districtCode}${dates}${pad}`
  } else if (author.role === ROLE.FASKES) {
    count = pre.count_case_pending.count_pasien;
    pad = count.toString().padStart(5, '0')
    id_case = `${CASE.PRE}${dinkesCodeFaskes}${dates}${pad}`;
  } else {
    count = pre.count_case.count_pasien;
    pad = count.toString().padStart(7, '0')
    id_case = `${CASE.CODE}${dinkesCode}${dates}${pad}`;
  }

  return id_case;
}

module.exports = {
  validatePost,
  generateIdCase,
}
