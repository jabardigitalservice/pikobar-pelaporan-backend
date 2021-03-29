const PayloadLaporMandri = (data) => {
  const date = new Date()
  data.last_date_status_patient = date.toISOString()

  const Obj = {
    last_date_status_patient: data.last_date_status_patient,
    diagnosis: data.symptoms,
  }
  return Obj
}

const splitPayload1 = (patient) =>{
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

const payloadLabkes = (payloadLabkes) => {
  const Obj = {
    name: payloadLabkes.name,
    nik: payloadLabkes.nik,
    birth_date: payloadLabkes.birth_date,
    age: payloadLabkes.age,
    month: payloadLabkes.month,
    yearsOld: payloadLabkes.yearsOld,
    monthsOld: payloadLabkes.monthsOld,
    gender: payloadLabkes.gender,
    phone_number: payloadLabkes.phone_number,
    address_street: payloadLabkes.address_street ? payloadLabkes.address_street : "Belum disi",
    address_district_code: payloadLabkes.address_district_code,
    address_district_name: payloadLabkes.address_district_name ? payloadLabkes.address_district_name : "None",
    address_subdistrict_code: payloadLabkes.address_subdistrict_code,
    address_subdistrict_name: payloadLabkes.address_subdistrict_name ? payloadLabkes.address_subdistrict_name : "None",
    address_village_code: payloadLabkes.address_village_code,
    address_village_name: payloadLabkes.address_village_name ? payloadLabkes.address_village_name: "None",
    rt: payloadLabkes.rt? payloadLabkes.rt : "0",
    rw: payloadLabkes.rw? payloadLabkes.rw : "0",
    nationality: payloadLabkes.nationality,
    place_of_birth: payloadLabkes.place_of_birth,
  }
  return Obj
}

const payloadLabkes2 = (payloadLabkes) => {
  const date = new Date().toISOString()
  const Obj = {
    current_location_type: "RUMAH",
    current_hospital_id: null,
    is_patient_address_same: true,
    last_date_status_patient: payloadLabkes.last_date_status_patient ? payloadLabkes.last_date_status_patient: date,
    current_location_address: payloadLabkes.address_street ? payloadLabkes.address_street : "Belum disi",
    current_location_district_code: payloadLabkes.address_district_code,
    current_location_subdistrict_code: payloadLabkes.address_subdistrict_code,
    current_location_village_code: payloadLabkes.address_village_code,
    current_location_village_name: payloadLabkes.address_village_name ? payloadLabkes.address_village_name: "None",
    latitude: "",
    longitude: "",
    input_source: "integrasi labkes",
  }
  return Obj
}



const splitCasePayload = (payloadLabkes) => {
  const Obj = {
    id_case_national: "",
    id_case_related: "",
    name_case_related: "",
    is_west_java: true,
    is_nik_exists: true,
    is_phone_number_exists: true,
    address_province_code: "32",
    address_province_name: "Jawa Barat",
    nationality_name: "",
    occupation: "Belum Bekerja",
    office_address: "",
    status: "CLOSECONTACT",
    stage: "",
    final_result: "5",
    report_source: "",
    there_are_symptoms: false,
    diagnosis: [],
    diagnosis_other: "",
    diseases: [],
    diseases_other: "",
    first_symptom_date: "",
    history_tracing: [],
    is_went_abroad: false,
    visited_country: "",
    return_date: "",
    is_went_other_city: false,
    visited_city: "",
    is_contact_with_positive: false,
    history_notes: "",
    other_notes: "",
    interviewers_name: "",
    interviewers_phone_number: "",
    interview_date: "",
    name_parents: "",
    note_nik: "",
    note_phone_number: "",
    diagnosis_ards: 2,
    diagnosis_covid: 2,
    diagnosis_pneumonia: 2,
    other_diagnosis: "",
    serum_check: false,
    sputum_check: false,
    swab_check: false,
    physical_check: "",
    pysichal_activity: "",
    smoking: 2,
    consume_alcohol: 2,
    income: "",
    travel: "",
    visited: "",
    start_travel: "",
    end_travel: "",
    close_contact: 2,
    close_contact_confirm: 2,
    close_contact_animal_market: 2,
    close_contact_public_place: 2,
    close_contact_medical_facility: 2,
    close_contact_heavy_ispa_group: false,
    close_contact_health_worker: false,
    apd_use: [],
    name_close_contact: "",
    id_close_contact: "",
    name_close_contact_confirm: "",
    id_close_contact_confirm: "",
    close_contact_patient: [],
    inspection_support: [],
    close_contacted_before_sick_14_days: false,
    travelling_history_before_sick_14_days: false,
    travelling_history: [],
    visited_local_area_before_sick_14_days: false,
    visited_local_area: [],
    has_visited_public_place: false,
    visited_public_place: [],
    area_transmision: [],
    close_contact_premier: [],
    is_other_diagnosisr_respiratory_disease: false,
    close_contact_have_pets: false,
    close_contact_performing_aerosol_procedures: false,
    other_diagnosisr_respiratory_disease: "",
    physical_check_temperature: "",
    physical_check_blood_pressure: "",
    physical_check_pulse: "",
    physical_check_respiration: "",
    physical_check_height: "",
    physical_check_weight: "",
    contact_date: "",
    transmission_types: 0,
    cluster_type: 0,
    cluster_other: "",
    animal_market_date: "",
    animal_market_other: "",
    public_place_date: "",
    public_place_other: "",
    medical_facility_date: "",
    medical_facility_other: "",
    health_workers: "",
    status_identity: 1,
    status_clinical: 1
  }
  return Obj
}



module.exports = {
  PayloadLaporMandri, splitPayload1, splitPayload2, splitPayload3,
  payloadLabkes, payloadLabkes2, splitCasePayload
}