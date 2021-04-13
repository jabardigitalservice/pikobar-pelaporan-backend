const mongoose = require('mongoose')
const {findUserCases, transformDataPayload, splitCodeAddr, splitNameAddr, transformDataCase, checkOwnerData} = require('../helpers/integration')
const {payloadInspectionSupport} = require('../helpers/integration/splitpayloadlabkes')
const {notify} = require('../helpers/notification')
require('../models/LogSelfReport')
const LogSelfReport = mongoose.model('LogSelfReport')
const {getCountBasedOnDistrict} = require('../helpers/cases/global')

const createInfoClinics = async (payload, services, callback) => {
  try {
    const data = JSON.parse(payload)
    //check data by nik or phone number
    const patient = await findUserCases(data)
    if (patient === null){
      let dataPub = {
        user_id : data.user_id,
        name : data.user.name,
        nik : data.user.nik,
        phone_number : data.user.phone_number,
        user_has_found : null
      }
      // save log if user not found when insert lapor mandiri
      let logPub = new LogSelfReport(dataPub)
      await logPub.save()
    }
    // transform payload with last data case patient
    const transData = await transformDataPayload(data, ...patient)
    const result = await integrationPikobarSelfReport(services, transData)
     return callback(null, result)
  } catch (error) {
    return callback(error, null)
  }
}

const integrationPikobarSelfReport = async(services, payload) =>{
  try {
    await services.histories.createIfChanged({payload}, (err, res) =>{
      if (err) throw new Error
      return res
    })
  } catch (error) {
    if (error) throw new Error
  }
}



const createOrUpdateCase = async (payload, services, callback) => {
  try {
    const data = JSON.parse(payload)
    const splitCode = await splitCodeAddr(data)
    const splitName = await splitNameAddr(splitCode)
    const author = await checkOwnerData(splitCode)
    const transformData= await transformDataCase(splitName)
    const checkUser = {user: {
      nik : transformData.nik,
      phone_number: transformData.phone_number
    }}
    const findUserData = await findUserCases(checkUser)
    let result = {}
    if(findUserData){
      result = await integrationLabkesUpdateCase(services,...findUserData, data)
    }else{
      result = await integrationLabkesCreateCase(services, transformData, author)
    }
    return callback(null, result)
  } catch (error) {
    return callback(error, null)
  }
}

const integrationLabkesCreateCase = async (services, payload, author) => {
  try {
    const pre = await getCountBasedOnDistrict(services, payload.address_district_code)
    await services.v2.cases.create(
      pre, payload, author,
      (err, res) => {
        if (err) throw new Error
        //TODO: tambhakan notif disni
        // notify('CreateCaseIntegrationLabkes', res, author)
        return res
    })
  } catch (error) {
    if (error) throw new Error
  }
}

const integrationLabkesUpdateCase = async(services, payload, payloadLabkes) => {
  const inspectionSupportPayload = await payloadInspectionSupport(payloadLabkes)
  const id_case = payload._id
  await services.inspection_support.create(inspectionSupportPayload, id_case,
    (err, res)=> {
     if (err) throw new Error
        //TODO: tambhakan notif disni
        // notify('CreateCaseIntegrationLabkes', res, author)
        return res
  })
}


module.exports = [
  {
    name: 'services.integration.createInfoClinics',
    method: createInfoClinics
  },
  {
    name: 'services.integration.createOrUpdateCase',
    method: createOrUpdateCase
  }
]