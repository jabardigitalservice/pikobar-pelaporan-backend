'use strict';
const check = require('../rolecheck');
const filterUser = (query, user) => {
    let params = check.userByRole({}, user);
    if (query.role) {
        params.role = query.role;
    }
    if (user.role == "dinkesprov" || user.role == "superadmin") {
        if (query.code_district_city) {
            params.code_district_city = query.code_district_city;
        }
    }
    if (query.address_village_code) {
        params.address_village_code = query.address_village_code;
    }
    if (query.address_subdistrict_code) {
        params.address_subdistrict_code = query.address_subdistrict_code;
    }
    return params;
}

const searchUser = (query) => {
    let search_params;
    if (query.search) {
        search_params = [
            { username: new RegExp(query.search, "i") },
            { fullname: new RegExp(query.search, "i") },
            { email: new RegExp(query.search, "i") },
            { phone_number: new RegExp(query.search, "i"), },
            { address_street: new RegExp(query.search, "i"), },
            { address_village_name: new RegExp(query.search, "i"), },
        ];
    } else {
        search_params = {};
    }
    return search_params;
};

module.exports = {
    filterUser, searchUser
}