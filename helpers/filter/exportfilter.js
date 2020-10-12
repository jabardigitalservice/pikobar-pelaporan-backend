const helpers = require("../custom")
const { GENDER, ANSWER } = require("../constant")

const excellOutput = (this_) => {
  let finals = helpers.patientStatus(this_.final_result)
  let criteria = helpers.criteriaConvert(this_)
  let interviewDate = this_.interview_date ? helpers.convertDate(this_.interview_date) : null
  let birthDate = this_.birth_date ? helpers.convertDate(this_.birth_date) : null
  let updatedDate = this_.updatedAt ? helpers.convertDate(this_.updatedAt) : null
  let createdDate = this_.createdAt ? helpers.convertDate(this_.createdAt) : null
  let symptomsDate = this_.first_symptom_date ? helpers.convertDate(this_.first_symptom_date) : null
  let lastDate = this_.last_date_status_patient ? helpers.convertDate(this_.last_date_status_patient) : null
  let apdUse = this_.apd_use ? this_.apd_use.toString() : null
  let patientLocation = helpers.locationPatient(this_.current_location_type, this_.current_location_address)

  return {
    "Nama Pewawancara": helpers.checkExistColumn(this_.interviewers_name),
    "No HP Pewawancara": helpers.checkExistColumn(this_.interviewers_phone_number),
    "Tanggal Wawancara": interviewDate,
    "Nama Pasien": this_.name,
    "NIK": this_.nik,
    "Alasan tidak ada NIK": helpers.checkExistColumn(this_.note_nik),
    "No Telepon": helpers.checkExistColumn(this_.phone_number),
    "Alasan Tidak Ada No Telepon": helpers.checkExistColumn(this_.note_phone_number),
    "Nama Orangtua": helpers.checkExistColumn(this_.name_parents),
    "Tempat Lahir": this_.place_of_birth,
    "Tanggal Lahir": birthDate,
    "Usia Tahun": Math.floor(this_.age),
    "Usia Bulan":  Math.ceil((this_.age - Math.floor(this_.age)) * 12),
    "Jenis Kelamin": this_.gender === "L" ? GENDER.ID_L : GENDER.ID_P,
    "Kota/Kab": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kel/Desa": this_.address_village_name,
    "Alamat Lengkap (RT/RW)": `${this_.address_street}`,
    "Pekerjaan": this_.occupation,
    "Alamat Kantor": this_.office_address,
    "Kewarganegaraan": this_.nationality,
    "Negara": this_.nationality === "WNI" ? "Indonesia" : this_.nationality_name,
    "Kriteria": criteria,
    "Status Pasien Terakhir": finals,
    "Tgl Update Status Pasien Terakhir": lastDate,
    "Lokasi Saat Ini": this_.current_location_address,
    "Terdapat Gejala": this_.there_are_symptoms ? ANSWER.YA : ANSWER.TIDAK,
    "Dirawat di Rumah Sakit ?": patientLocation.bool,
    "Nama Rumah Sakit": patientLocation.location_name,
    "Tanggal Gejala": symptomsDate,
    ...helpers.checkDiagnosis(this_.diagnosis),
    "Gejala Lainnya": helpers.checkExistColumn(this_.diagnosis_other),
    ...helpers.checkDiseases(this_.diseases),
    "Kondisi Penyerta Lainnya": this_.diseases_other,
    "Diagnosis ARDS": helpers.convertYesOrNO(this_.diagnosis_ards),
    "Diagnosis Pneumonia": helpers.convertYesOrNO(this_.diagnosis_pneumonia),
    "Diagnosis Lainnya": this_.other_diagnosis,
    "Etiologi": helpers.yesOrNoBool(this_.is_other_diagnosisr_respiratory_disease),
    "Sebutkan Etiologi Lainnya": this_.other_diagnosisr_respiratory_disease,
    "Alat Pelindung yang Digunakan": apdUse,
    "Merokok": helpers.convertYesOrNO(this_.smoking),
    "Konsumsi Alkohol": helpers.convertYesOrNO(this_.consume_alcohol),
    "Aktifitas Fisik": helpers.convertPysichal(this_.pysichal_activity),
    "Penghasilan": helpers.convertIncome(this_.income),
    "Tanggal Update Riwayat": updatedDate,
    "Author": this_.author,
    "Tanggal Input": createdDate,
  }
}

const sqlCondition = (params, search, query) => {
  let searching = Object.keys(search).length == 0 ? [search] : search
  let createdAt = {}
  if (query.start_date && query.end_date){
    let searchRegExp = new RegExp('/', 'g')
    let min = query.start_date
    let max = query.end_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    createdAt = {
      "createdAt" :{
        "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
        "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
    }}
  }
  let andParam = { ...createdAt, ...params }
  return [
    {
      $match: {
        $and : [ andParam ],
        $or : searching
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author_list"
      }
    }, {
      $lookup: {
        from: "histories",
        localField: "last_history",
        foreignField: "_id",
        as: "history_list"
      },
    },
    { $sort: { "history_list._id": -1, "cases._id": -1 } },
    { $unwind: '$author_list' },
    { $unwind: '$history_list' },
    {
      "$project": {
        "_id": 1,
        "id": "$id_case",
        "interviewer_name": "$interviewers_name",
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
        "office_address": "$office_address",
        "nationality": "$nationality",
        "nationality_name": "$nationality_name",
        "status": "$status",
        "final_result": "$final_result",
        "there_are_symptoms": "$there_are_symptoms",
        "last_date_status_patient": "$last_date_status_patient",
        "current_location_type": "$current_location_type",
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
        "apd_use": "$apd_use",
        "smoking": "$history_list.smoking",
        "consume_alcohol": "$history_list.consume_alcohol",
        "pysichal_activity": "$history_list.pysichal_activity",
        "income": "$income",
        "createdAt": "$createdAt",
        "updatedAt": "$updatedAt",
        "author": "$author_list.fullname",
      }
    }
  ]
}

module.exports = {
  excellOutput, sqlCondition
}