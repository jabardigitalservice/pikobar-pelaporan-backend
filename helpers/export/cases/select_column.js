const columnInfo = {
  "_id": 1,
  "id": "$id_case",
  "interviewers_name": "$interviewers_name",
  "interviewers_phone_number": "$interviewers_phone_number",
  "interviewers_date": "$interviewers_date",
  "name": "$name",
  "nik": "$nik",
  "note_nik": "$note_nik",
  "phone_number": "$phone_number",
  "note_phone_number": "$note_phone_number",
  "name_parents": "$name_parents",
  "place_of_birth": "$place_of_birth",
  "birth_date": "$birth_date",
  "age": "$age",
  "month": "$month",
  "gender": "$gender",
  "address_district_name": "$address_district_name",
  "address_subdistrict_name": "$address_subdistrict_name",
  "address_village_name": "$address_village_name",
  "address_street":"$address_street",
  "rt":"$rt",
  "rw":"$rw",
  "occupation": "$occupation",
}

const columnIdentity = {
  "office_address": "$office_address",
  "nationality": "$nationality",
  "nationality_name": "$nationality_name",
  "status": "$status",
  "final_result": "$final_result",
  "there_are_symptoms": "$there_are_symptoms",
  "last_date_status_patient": "$last_date_status_patient",
  "current_location_type": "$history_list.current_location_type",
  "current_location_address": "$history_list.current_location_address",
  "first_symptom_date": "$history_list.first_symptom_date",
  "diagnosis": "$history_list.diagnosis",
  "diagnosis_other": "$history_list.diagnosis_other",
  "diseases": "$history_list.diseases",
  "diseases_other": "$history_list.diseases_other",
  "diagnosis_ards": "$history_list.diagnosis_ards",
  "diagnosis_pneumonia": "$history_list.diagnosis_pneumonia",
  "other_diagnosis": "$history_list.other_diagnosis",
  "is_other_diagnosisr_respiratory_disease": "$history_list.is_other_diagnosisr_respiratory_disease",
  "other_diagnosisr_respiratory_disease": "$history_list.other_diagnosisr_respiratory_disease",
  "is_went_abroad": "$is_went_abroad",
  "diagnosis_pneumonia": "$history_list.diagnosis_pneumonia",
}

const columnAuthor = {
  "apd_use": "$apd_use",
  "smoking": "$history_list.smoking",
  "consume_alcohol": "$history_list.consume_alcohol",
  "pysichal_activity": "$history_list.pysichal_activity",
  "income": "$income",
  "createdAt": "$createdAt",
  "updatedAt": "$updatedAt",
  "author": "$author_list.fullname",
}

module.exports = {
  columnIdentity, columnInfo, columnAuthor
}