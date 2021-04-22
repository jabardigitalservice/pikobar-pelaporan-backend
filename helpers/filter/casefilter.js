const filterCase = async (user, query) => {
  const params = {};
  // only provide when needed
  if (query.author_district_code) {
    params.author_district_code = query.author_district_code;
  }
  if (user.role == "dinkesprov" || user.role == "superadmin") {
    if (query.address_district_code) {
      params.address_district_code = query.address_district_code;
    }
  }
  if (query.address_village_code) {
    params.address_village_code = query.address_village_code;
  }
  if (query.address_subdistrict_code) {
    params.address_subdistrict_code = query.address_subdistrict_code;
  }
  if (query.verified_status && query.verified_status.split) {
    params.verified_status = { $in: query.verified_status.split(',') }
  }
  if (query.status) { params.status = query.status }
  if (query.final_result) { params.final_result = query.final_result }
  if (query.tool_tester) { params.tool_tester = query.tool_tester }
  if (query.criteria) { params.status = query.criteria }
  return params;
}

const filterRdt = (user, query) => {
  const params = {};

  if (user.role == "dinkesprov" || user.role == "superadmin") {
    if (query.address_district_code) {
      params.address_district_code = query.address_district_code;
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

module.exports = {
  filterCase,
  filterRdt
}