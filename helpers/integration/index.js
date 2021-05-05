const ObjectId = require('mongoose').Types.ObjectId
const User = require('../../models/User')
const History = require('../../models/History')
const LogSelfReport = require('../../models/LogSelfReport')
const {PayloadLaporMandri, splitPayloadOne, splitPayloadTwo, splitPayloadThree} = require('./splitpayloadpikobar')
const {mergerPayloadlabkes, mergeSplitPayload} = require('./splitpayloadlabkes')
const {PUBSUB, ROLE} = require('../constant')

const filterOwnerData = (data) =>{
  const SET_DEFAULT_SUBDISTRICT = "32.00.00"
  if (data.address_subdistrict_code !== SET_DEFAULT_SUBDISTRICT) {
    return {
      code_district_city: data.address_district_code,
      address_subdistrict_code: data.address_subdistrict_code
    }
  } else {
    return {
      code_district_city: data.address_district_code,
    }
  }
}

const checkOwnerData = async(data) => {
  let filter = {}
  if(data.id_fasyankes_pelaporan){
    filter = {unit_id: new ObjectId(data.id_fasyankes_pelaporan)}
  }else{
    filter = filterOwnerData(data)
  }
  const users = await queryOwnerData(filter)
  return users[0]
}

const alternativeOwnerData = async(data) => {
  let filter = filterOwnerData(data)
  const users = await queryOwnerData(filter)
   if (users.length > 0 ) {
    return users[0]
  }
  const alternative = await queryOwnerDataAlternatif(data)
  return alternative[0]
}

const queryOwnerData = async(filter) =>{
  return await User.find({
     role: ROLE.FASKES,
     ...filter
  }).sort({last_login: -1})
}

const queryOwnerDataAlternatif = async(data)=> {
  return await User.find({
     role: ROLE.FASKES,
     code_district_city: data.address_district_code
  }).sort({last_login: -1})
}

const statusPikobar = (status)=> {
  let nameStatus = ""
  switch (status) {
    case "OTG":
      nameStatus = PUBSUB.OTG
      break;
    case "CONFIRMED":
      nameStatus = PUBSUB.CONFIRMED
      break;
    case "PDP":
      nameStatus = PUBSUB.PDP
      break;
    case "ODP":
      nameStatus = PUBSUB.ODP
      break;
    default:
      nameStatus = undefined
      break;
  }
  return nameStatus
}

const userHasFound = async (data) =>{
  const date = new Date().toISOString()
  try {
     const check  = await LogSelfReport.findOne({nik: data.user.nik}).or({phone_number: data.user.phone_number})

    if (check.user_has_found === null) {
      await LogSelfReport.updateOne(
        {$or: [{nik: data.user.nik}, {phone_number: data.user.phone_number}]},
        {$set: {user_has_found: date}}
      )
    }
  } catch (error) {
    return error
  }

  return null
}

const ifActionEdit = async (data, patient, transform) =>{
  const ENUM_ACTION_EDIT = "edit"
  if (data.action === ENUM_ACTION_EDIT) {
    await History.findByIdAndUpdate(patient.last_history,
      { $set: transform },
      { new: true },
    )
    return true
  } else {
    return false
  }

}

const transformDataPayload = (data, patient) => {
  userHasFound(data)

  const transform = {
    ...PayloadLaporMandri(data),
    ...splitPayloadOne(patient),
    ...splitPayloadTwo(patient),
    ...splitPayloadThree(patient)
  }

  ifActionEdit(data, patient, transform)

  return transform
}

const splitCodeAddr = (data) => {
  let address_district_code = "32.00"
  if (data.address_district_code) {
    let split_district = (data.address_district_code).toString()
    address_district_code = (split_district.substring(0,2)).concat(".",split_district.substring(2,4))
  }

  let address_subdistrict_code = "32.00.00"
  if (data.address_subdistrict_code) {
    let split_subdistrict = (data.address_subdistrict_code).toString()
    address_subdistrict_code = (split_subdistrict.substring(0,2)).concat(".",split_subdistrict.substring(2,4),".",split_subdistrict.substring(4,7))
  }

  let address_village_code = "32.00.00.0000"
  if (data.address_village_code) {
    let split_village = (data.address_village_code).toString()
    address_village_code = (split_village.substring(0,2)).concat(".",split_village.substring(2,4),".",split_village.substring(4,6),".",split_village.substring(6,11))
  }

  const code = {
    address_district_code: address_district_code,
    address_subdistrict_code: address_subdistrict_code,
    address_village_code: address_village_code,
  }

  data = Object.assign(data, code)
  return data
}

const splitNameAddr = (data) => {
  let name_address_street = "Belum disi"
  if (data.address_street) {
    name_address_street = data.address_street
  }
  let name_district = "None"
  if (data.address_district_name) {
    name_district = data.address_district_name
  }
  let name_subdistrict = "None"
  if (data.address_subdistrict_name) {
    name_subdistrict = data.address_subdistrict_name
  }
  let name_village = "None"
  if (data.address_village_name) {
    name_village = data.address_village_name
  }

  const name = {
    address_street: name_address_street,
    address_district_name: name_district,
    address_subdistrict_name: name_subdistrict,
    address_village_name: name_village
  }
  data = Object.assign(data, name)
  return data
}

const transformDataCase = (data) => {
  const groupingpayload = {
    ...mergerPayloadlabkes(data),
    ...mergeSplitPayload()
  }
  return groupingpayload
}

module.exports = {
  transformDataPayload,
  splitCodeAddr, splitNameAddr, transformDataCase,
  checkOwnerData, alternativeOwnerData
}