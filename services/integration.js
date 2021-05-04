const mongoose = require('mongoose')
const {findUserCases} = require('../helpers/integration/findusercases')
const {transformDataPayload, splitCodeAddr, splitNameAddr, transformDataCase, checkOwnerData, alternativeOwnerData} = require('../helpers/integration')
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
      return resultIntegration(err, res, "PIKOBAR_UPDATE");
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
    const checkAuthor = await checkOwnerData(splitCode)
    const alternativeAuthor = await alternativeOwnerData(splitCode)
    const author = checkAuthor ? checkAuthor : alternativeAuthor
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
        return resultIntegration(err, res, "LABKES_CREATE");
    })
  } catch (error) {
    return error
  }
}

const integrationLabkesUpdateCase = async(services, payload, payloadLabkes) => {
  try {
    const inspectionSupportPayload = await payloadInspectionSupport(payloadLabkes)
    const id_case = payload._id
    await services.inspection_support.create(inspectionSupportPayload, id_case,
      (err, res)=> {
        return resultIntegration(err, res, "LABKES_UPDATE");
    })
  } catch (error) {
    return error
  }

}

//TODO: tambhakan notif disni
// notify('CreateCaseIntegrationLabkes', res, author)
const resultIntegration = (err, res, str) =>{
  if (err) throw new Error

  switch (str) {
    case "PIKOBAR_UPDATE":
      console.log(`PIKOBAR SUCCESS UPDATED ID : ${res.case}`);
      break;
    case "LABKES_CREATE":
      console.log(`LABKES SUCCESS CREATED ID : ${res._id}`);
      break;
    case "LABKES_UPDATE":
      console.log(`LABKES SUCCESS UPDATED ID : ${res}`);
      break;
    default:
      console.log(`NOTHING TO UPDATE OR CREATE :( `);
      break;
  }

  return res
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