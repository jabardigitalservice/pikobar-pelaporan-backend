'use strict'
const filterUnit = (query) => {
  let params = {}
  if (query.unit_type) {
    params.unit_type = query.unit_type
  }
  if (query.code_district_code) {
    params.code_district_code = query.code_district_code
  }
  return params
}

const filterSearch = (query) => {
  let search_params
  if (query.search) {
    search_params = [
      { unit_code: new RegExp(query.search, "i") },
      { unit_type: new RegExp(query.search, "i") },
      { name: new RegExp(query.search, "i") }
    ]
  } else {
    search_params = {}
  }
  return search_params
}

module.exports = {
  filterUnit, filterSearch
}