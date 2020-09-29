'use strict';
const { CASE, ROLE } = require('../../constant');
const moment = require('moment');
const validatePost = (raw_payload) => {
    if (raw_payload.current_hospital_id === "") {
        raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date === "") {
        raw_payload.first_symptom_date = Date.now();
    }

    return raw_payload;
};

const generateIdCase = (author, pre) => {
    let dates = moment(new Date()).format("YY");
    let id_case;
    // let pasienCount ='';
    let pendingCount = '';
    let pad="";
    let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
    let dinkesCode = pre.count_case.dinkes_code;

    if (author.role === ROLE.FASKES) {

        pendingCount = pre.count_case_pending.count_pasien;
        pad = pendingCount.toString().padStart(5, "0")
        id_case = `${CASE.PRE}${dinkesCodeFaskes}${dates}${pad}`;
    } else {

        pendingCount = pre.count_case.count_pasien;
        pad = pendingCount.toString().padStart(7, "0")
        id_case = `${CASE.CODE}${dinkesCode}${dates}${pad}`;
    }

    return id_case;
}

module.exports = {
    validatePost, generateIdCase,
}