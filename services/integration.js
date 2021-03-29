const mongoose = require('mongoose')
const {findUserCases, transformDataPayload, splitCodeAddr, splitNameAddr, transformDataCase} = require('../helpers/integration')
require('../models/LogSelfReport')
const LogSelfReport = mongoose.model('LogSelfReport')

const createInfoClinics = async (payload) => {
  const data = JSON.parse(payload)
  try {
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

      let logPub = new LogSelfReport(dataPub)
      await logPub.save()
    }

    // transform payload with last data case patient
    const transData = await transformDataPayload(data, ...patient)

    return transData
  } catch (error) {
    return error
  }

}

const createOrUpdateCase = async (payload) => {
  const data = JSON.parse(payload)
  const splitCode = await splitCodeAddr(data)
  const splitName = await splitNameAddr(splitCode)
  const transformData= await transformDataCase(splitName)

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