/**
 *
 *
 * @param {*} user
 * @param {*} query
 * @param {*} unique
 * @return {string}
 */

const validateQueryDashboard = (user, query, unique) => {
  const parseQuery = JSON.stringify(query) // parse query string nodejs to string
  const toJson = JSON.parse(parseQuery) // parse string to object
  let str = [] // define array

  // loop for set to new arrray
  for (let prop in toJson) {
    str.push(toJson[prop])
  }

  const joinStr = str.join('-') // convert array to string with '-'

  if(query) {
    key = `${unique}-${user.username}-${joinStr}`
  } else {
    key = `${unique}-${user.username}-${user.code_district_city}`
  }

  return key
}

/**
 *
 *
 * @param {*} query
 * @param {*} user
 * @param {*} time
 * @param {*} keys
 * @return {}
 */
const keyDashboard = (query, user, time, keys) => {
  const expireTime = time * 60 // rules 1 minute = 60 seconds

  /** @type {*} */
  const key = validateQueryDashboard(user, query, keys)

  return { key, expireTime }
}

module.exports = {
  keyDashboard
}