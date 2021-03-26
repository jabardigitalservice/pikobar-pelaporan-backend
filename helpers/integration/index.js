const { object } = require('joi')
const {} = require('mongoose')
const Case = require('../../models/Case')
const History = require('../../models/History')
const LogSelfReport = require('../../models/LogSelfReport')
const {PUBSUB} = require('../constant')

const findUserCases = async(data) => {
  const user = data.user
  let filter = {}
  if (user.nik === "" || user.nik === null || user.nik === undefined){
    filter = {phone_number: user.phone_number}
  }else{
    filter = {nik: user.nik}
  }

  const cases = await Case.aggregate([
    { $match : filter },
    { $lookup :{from: "histories", localField: 'last_history', foreignField: '_id', as: 'histories' }},
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$histories", 0 ] }, "$$ROOT" ] } }},
    { $project : {histories: 0}},
    { $limit: (1)}
  ])
  return (cases.length > 0 ? cases : null)
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

const splitPayload1 = (data, patient) =>{
  const date = new Date()
  data.last_date_status_patient = date.toISOString()

  const Obj = {
    last_date_status_patient: data.last_date_status_patient,
    diagnosis: data.symptoms,
    status: patient.status,
    there_are_symptoms: patient.there_are_symptoms,
    first_symptom_date: patient.first_symptom_date,
    diagnosis_ards: patient.diagnosis_ards,
    diagnosis_covid: patient.diagnosis_covid,
    diagnosis_pneumonia: patient.diagnosis_pneumonia,
    diagnosis_other: patient.diagnosis_other,
    physical_check_temperature: patient.physical_check_temperature,
    physical_check_blood_pressure: patient.physical_check_blood_pressure,
    physical_check_pulse: patient.physical_check_pulse,
    physical_check_respiration: patient.physical_check_respiration,
    physical_check_height: patient.physical_check_height,
    physical_check_weight: patient.physical_check_weight,
    other_diagnosis: patient.other_diagnosis,
    other_diagnosisr_respiratory_disease: patient.other_diagnosisr_respiratory_disease,
    last_changed: patient.last_changed,
    diseases: patient.diseases,
    diseases_other: patient.diseases_other,
  }
  return Obj
}

const splitPayload2 = (patient) =>{
  let Obj = {
    nik:patient.case,
    phone_number:patient.phone_number,
    case : patient.case,
    history_tracing : patient.history_tracing,
    is_went_abroad : patient.is_went_abroad,
    visited_country : patient.visited_country,
    return_date : patient.return_date,
    is_went_other_city : patient.is_went_other_city,
    visited_city : patient.visited_city,
    is_patient_address_same : patient.is_patient_address_same,
    is_contact_with_positive : patient.is_contact_with_positive,
    history_notes : patient.history_notes,
    report_source : patient.report_source,
    stage : patient.stage,
    final_result : patient.final_result,
    is_other_diagnosisr_respiratory_disease : patient.is_other_diagnosisr_respiratory_disease,
    pysichal_activity : patient.pysichal_activity,
    smoking : patient.smoking,
    consume_alcohol : patient.consume_alcohol
  }

  return Obj
}

const splitPayload3 = (patient) => {
  let Obj =  {
    current_location_type : patient.current_location_type,
    current_hospital_id : patient.current_hospital_id,
    current_location_address : patient.current_location_address,
    current_location_district_code : patient.current_location_district_code,
    current_location_subdistrict_code : patient.current_location_subdistrict_code,
    current_location_village_code : patient.current_location_village_code,
    other_notes : patient.other_notes,
    current_hospital_type : patient.current_hospital_type,
    current_location_province_code : patient.current_location_province_code,
    address_district_code : patient.address_district_code,
    address_subdistrict_code : patient.address_subdistrict_code,
    address_village_code : patient.address_village_code,
    address_village_name : patient.address_village_name,
    address_street : patient.address_street,
  }

  return Obj
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
    ...splitPayload1(data, patient),
    ...splitPayload2(patient),
    ...splitPayload3(patient)
  }

  ifActionEdit(data, patient, transform)

  return transform
}

const splitCodeAddr = (data) => {

  let address_district_code = "32.00"
  if (data.address_district_code) {
    let split_district = (data.address_district_code).toString()
    let split_district_1 = split_district.substring(0,2)
    let split_district_2 = split_district.substring(2,4)
    address_district_code = split_district_1.concat(".",split_district_2)
  }

  let address_subdistrict_code = "32.00.00"
  if (data.address_subdistrict_code) {
    let split_subdistrict = (data.address_subdistrict_code).toString()
    let split_subdistrict1 = split_subdistrict.substring(0,2)
    let split_subdistrict2 = split_subdistrict.substring(2,4)
    let split_subdistrict3 = split_subdistrict.substring(4,7)
    address_subdistrict_code = split_subdistrict1.concat(".",split_subdistrict2,".",split_subdistrict3)
  }

  let address_village_code = "32.00.00.0000"
  if (data.address_village_code) {
    let split_village = (data.address_village_code).toString()
    let split_village1 = split_village.substring(0,2)
    let split_village2 = split_village.substring(2,4)
    let split_village3 = split_village.substring(4,6)
    let split_village4 = split_village.substring(6,11)
    address_village_code = split_village1.concat(".",split_village2,".",split_village3,".",split_village4)
  }

  const code = {
    address_district_code: address_district_code,
    address_subdistrict_code: address_subdistrict_code,
    address_village_code: address_village_code
  }

  data = Object.assign(data, code)
  return data
}


module.exports = {
  findUserCases, transformDataPayload, splitCodeAddr
}

