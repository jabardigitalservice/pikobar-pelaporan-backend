const date = new Date()
const {INSPECTION_TYPES, SPECIMEN_TYPES} = require('../constant')

const payloadLabkes1 = (payloadLabkes) => {
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
    nationality: payloadLabkes.nationality,
    place_of_birth: payloadLabkes.place_of_birth,
  }
  return Obj
}
const payloadLabkes2 = (payloadLabkes) => {
  const Obj = {
    address_street:payloadLabkes.address_street,
    address_district_code: payloadLabkes.address_district_code,
    address_district_name: payloadLabkes.address_district_name,
    address_subdistrict_code: payloadLabkes.address_subdistrict_code,
    address_subdistrict_name: payloadLabkes.address_subdistrict_name,
    address_village_code: payloadLabkes.address_village_code,
    address_village_name: payloadLabkes.address_village_name,
    rt: payloadLabkes.rt? payloadLabkes.rt : "0",
    rw: payloadLabkes.rw? payloadLabkes.rw : "0",
  }
  return Obj
}
const payloadLabkes3 = (payloadLabkes) => {
  const Obj = {
    current_location_type: "RUMAH",
    current_hospital_id: null,
    is_patient_address_same: true,
    last_date_status_patient: payloadLabkes.last_date_status_patient ? payloadLabkes.last_date_status_patient: date.toISOString(),
    current_location_address: payloadLabkes.address_street,
    current_location_district_code: payloadLabkes.address_district_code,
    current_location_subdistrict_code: payloadLabkes.address_subdistrict_code,
    current_location_village_code: payloadLabkes.address_village_code,
    current_location_village_name: payloadLabkes.address_village_name,
    latitude: "",
    longitude: "",
    input_source: "integrasi labkes",
  }
  return Obj
}

const mergerPayloadlabkes = (payloadLabkes) => {
  const Merge = {
    ...payloadLabkes1(payloadLabkes),
    ...payloadLabkes2(payloadLabkes),
    ...payloadLabkes3(payloadLabkes),
  }
  return Merge
}

const splitCasePayload1 = () => {
  const Obj = {
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

const splitCasePayload2 = () => {
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
    status: "CONFIRMATION",
    stage: "",
    final_result: "4",
    report_source: "",
    there_are_symptoms: false,
    diagnosis: [],
    diagnosis_other: "",
    diseases: [],
    diseases_other: "",
  }
  return Obj
}

const splitCasePayload3 = () => {
  const Obj = {
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
  }
  return Obj
}

const splitCasePayload4 = () => {
  const Obj = {
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
  }
  return Obj
}

const splitCasePayload5 = () => {
  const Obj = {
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
  }
  return Obj
}

const mergeSplitPayload = () => {
  const Merge = {
    ...splitCasePayload1(),
    ...splitCasePayload2(),
    ...splitCasePayload3(),
    ...splitCasePayload4(),
    ...splitCasePayload5(),
  }
  return Merge
}

const payloadInspectionSupport = (data) =>{
  const Obj = {
    inspection_type: INSPECTION_TYPES.PCR,
    specimens_type: SPECIMEN_TYPES.SWAB_NASO_OROF,
    inspection_date: data.inspection_date,
    inspection_location: "",
    is_other_location: false,
    other_inspection_location: "lainnya",
    get_specimens_to: data.get_specimens_to,
    inspection_result: data.inspection_result
  }
  return Obj
}


module.exports = {
  mergerPayloadlabkes,
  mergeSplitPayload,
  payloadInspectionSupport
}