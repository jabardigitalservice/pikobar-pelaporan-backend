const filterCase = async (user, query) => {
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

  if (query.start_date && query.end_date) {
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }

  if (query.verified_status && query.verified_status.split) {
    params.verified_status = { $in: query.verified_status.split(',') }
  }

  if (query.status) {
    params.status = query.status;
  }

  if (query.final_result) {
    params.final_result = query.final_result;
  }

  return params;
}

const filterRdt = async (user, query) => {
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