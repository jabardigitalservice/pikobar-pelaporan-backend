const { ROLE } = require('../constant')

validateQuery = (key, query, user) => {
  if(query.date && query.address_district_code) {
    key = `daily-reports-${user.username}-${query.date}-${query.address_district_code}`
  } else if(query.address_district_code) {
    key = `daily-reports-${user.username}-${query.address_district_code}`
  } else if(query.date) {
    key = `daily-reports-${user.username}-${query.date}`
  } else {
    key = `daily-reports-${user.username}`
  }

  return key
}

const setKeyReport = (query, user) => {
  let key
  if(user.role === ROLE.ADMIN) {
    key = validateQuery(key, query, user)
  } else {
    key = validateQuery(key, query, user)
  }

  return key
}

module.exports = { setKeyReport }
