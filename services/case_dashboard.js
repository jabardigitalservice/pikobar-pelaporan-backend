const Case = require('../models/Case')
const { summaryAggregate }  = require('../helpers/aggregate/summaryaggregate')
const { topAggregate }  = require('../helpers/aggregate/topaggregate')
const { clientConfig } = require('../config/redis')

const mapingCondition = (user, obj) => {
  if (user.code_district_city === obj.name[0].id){
    obj._id = obj._id
  } else {
    obj._id = `Diluar kota/kab ${obj._id}`
  }
  return obj
}

const validationRole = (result, user) => {
  const { ROLE } = require("../helpers/constant")
  if([ROLE.ADMIN, ROLE.PROVINCE].includes(user.role)){
    return result
  } else {
    result.map(res => {
      res.summary.map(s =>  mapingCondition(user, s))
      res.demographic.map(d => mapingCondition(user, d))
      res.date_version = new Date().toISOString()
      return res
    })
  }

  return result
}

async function countSectionTop(query, user, callback) {
  const { keyDashboard } = require('../helpers/filter/redis')
  // 15 minute expire
  const { key, expireTime } = keyDashboard(query, user, 10, 'summary-dashboard-criteria')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info(`redis source ${key}`)
      }else{
        const row = await sameCondition(query, user, topAggregate)
        row.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(key, expireTime, JSON.stringify(row)) // set redis key
        callback(null, row)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

async function countSummary(query, user, callback) {
  const { keyDashboard } = require('../helpers/filter/redis')
  // 10 minute expire
  const { key, expireTime } = keyDashboard(query, user, 10, 'summary-case')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info(`redis source ${key}`)
      }else{
        const condition = await sameCondition(query, user, summaryAggregate)
        const row = validationRole(condition, user)
        clientConfig.setex(key, expireTime, JSON.stringify(row)) // set redis key
        callback(null, row)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

async function countVisualization(query, user, callback) {
  const { visualizationAggregate }  = require('../helpers/aggregate/visualizationaggregate')
  const { keyDashboard } = require('../helpers/filter/redis')
  // 10 minute expire
  const { key, expireTime } = keyDashboard(query, user, 10, 'summary-visualization')
  try {
    clientConfig.get(key, async (err, result) => {
      if(result){
        callback(null, JSON.parse(result))
        console.info(`redis source ${key}`)
      }else{
        const condition = await visualizationAggregate(query, user)
        const row = await Case.aggregate(condition)
        row.map(r => r.date_version = new Date().toISOString())
        clientConfig.setex(key, expireTime, JSON.stringify(row)) // set redis key
        callback(null, row)
        console.info(`api source ${key}`)
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

const sameCondition = async (query, user, models) => {
  const condition = await models(query, user)
  const resultCount = await Case.aggregate(condition)

  return resultCount
}

module.exports = [
  {
    method: countSectionTop,
    name: 'services.case_dashboard.countSectionTop',
  },{
    name: 'services.case_dashboard.countSummary',
    method: countSummary,
  },{
    name: 'services.case_dashboard.countVisualization',
    method: countVisualization,
  }
]
