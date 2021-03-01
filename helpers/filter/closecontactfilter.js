'use strict';
const consts = require('../constant')
const filterCloseContact = (query, user) => {
    let params = { is_case_deleted: false }
    if (user.role !== consts.ROLE.FASKES) {
        if (query.address_district_code) {
            params.address_district_code = query.address_district_code;
        }
    } else {
        params.address_district_code = user.code_district_city
    }

    if (query.address_subdistrict_code) {
        params.address_subdistrict_code = query.address_subdistrict_code;
    }
    if (query.address_village_code) {
        params.address_village_code = query.address_village_code;
    }
    if (query.gender) {
        params.gender = query.gender;
    }
    if (typeof query.is_reported === "boolean") {
        params.is_reported = query.is_reported;
    }
    return params;
};

const filterSearch = (query) => {
    let search_params = {};
    if(query.search){ 
        search_params = [
            { name: new RegExp(query.search, "i") }
        ];
    }
    return search_params;
}; 

module.exports = {
    filterCloseContact, filterSearch
}