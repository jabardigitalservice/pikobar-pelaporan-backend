const Case = require('../models/Case')
const { aggregateCondition } = require('../helpers/aggregate/mapaggregate')
const { patientStatus } = require('../helpers/custom')
const { ROLE } = require('../helpers/constant')
const { clientConfig } = require('../config/redis')

const listMap = async (query, user, callback) => {
  const expireTime = 15 * 60 * 1000 // 15 minute expire
  let key
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    key = `list-map-${user.username}`
  }else if([ROLE.KOTAKAB].includes(user.role)){
    key = `list-map-${user.username}-${user.code_district_city}`
  }else{
    key = `list-map-${user.id}-${user.code_district_city}`
  }
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info(`redis source ${key}`)
      }else{
        const aggregateWhere = await aggregateCondition(user, query)
        const result = await Case.aggregate(aggregateWhere)
        result.map(res => res.final_result = patientStatus(res.final_result))
        clientConfig.setex(key, expireTime, JSON.stringify(result)) // set redis key
        callback(null, result)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) { callback(error, null) }
}


const listSummary = async (query, user, callback) => {
  try {
    const { summaryMap } = require('../helpers/aggregate/mapsummaryaggregate')
    const aggregateWhere = await summaryMap(user, query)
    const result = await Case.aggregate(aggregateWhere)
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}


module.exports = [
  {
    name:'services.map.listMap',
    method:listMap
  },{
    name:'services.map.listSummary',
    method:listSummary
  }
];

