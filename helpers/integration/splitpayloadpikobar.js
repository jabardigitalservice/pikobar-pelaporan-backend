const date = new Date()

const PayloadLaporMandri = (data) => {
  data.last_date_status_patient = date.toISOString()

  const Obj = {
    last_date_status_patient: data.last_date_status_patient,
    diagnosis: data.symptoms,
  }
  return Obj
}

const splitPayloadOne = (patient) =>{
  const Obj = {
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

const splitPayloadTwo = (patient) =>{
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

const splitPayloadThree = (patient) => {
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

module.exports = {
  PayloadLaporMandri,
  splitPayloadOne,
  splitPayloadTwo,
  splitPayloadThree
}