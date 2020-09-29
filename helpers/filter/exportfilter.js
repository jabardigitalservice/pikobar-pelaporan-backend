const helpers = require("../custom")
const { GENDER, ANSWER } = require("../constant")

const excellOutput = (this_) => {
  let finals = helpers.patientStatus(this_)
  let criteria = helpers.criteriaConvert(this_)
  let birthDate = this_.birth_date ? helpers.convertDate(this_.birth_date) : null
  let updatedDate = this_.updatedAt ? helpers.convertDate(this_.updatedAt) : null
  let createdDate = this_.createdAt ? helpers.convertDate(this_.createdAt) : null
  let interviewDate = this_.interview_date ? helpers.convertDate(this_.interview_date) : null
  let symptomsDate = this_.first_symptom_date ? helpers.convertDate(this_.first_symptom_date) : null
  let travelDate = this_.travelling_date ? helpers.convertDate(this_.travelling_date) : null
  let travelArrive = this_.travelling_arrive ? helpers.convertDate(this_.travelling_arrive) : null
  let diagnosis = this_.diagnosis ? this_.diagnosis.toString() : null
  let diagnosisOther = this_.diseases ? this_.diseases.toString() : null
  let apdUse = this_.apd_use ? this_.apd_use.toString() : null
  let close_contact_name = []
  this_.close_contact_list.map(r => {
    close_contact_name.push(r.name)
    return close_contact_name
  })

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
    "Usia Tahun": this_.age,
    "Usia Bulan": this_.month,
    "Jenis Kelamin": this_.gender === "L" ? GENDER.ID_L : GENDER.ID_P,
    "Kota/Kab": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kel/Desa": this_.address_village_name,
    "Alamat Lengkap (RT/RW)": `${this_.address_street} (${this_.rt}/${this_.rw})`,
    "Pekerjaan": this_.occupation,
    "Alamat Kantor": this_.office_address,
    "Kewarganegaraan": this_.nationality == "WNI" ? "Indonesia" : this_.nationality_name,
    "Kriteria": criteria,
    "Status Pasien Terakhir": finals,
    "Lokasi Saat Ini": this_.current_location_address,
    "Terdapat Gejala": this_.there_are_symptoms ? ANSWER.YA : ANSWER.TIDAK,
    "Tanggal Muncul Gejala": symptomsDate,
    "Gejala": diagnosis,
    "Kondisi Penyerta": diagnosisOther,
    "Diagnosis ARDS": helpers.convertYesOrNO(this_.diagnosis_ards),
    "Diagnosis Pneumonia": helpers.convertYesOrNO(this_.diagnosis_pneumonia),
    "Diagnosis Lainnya": this_.other_diagnosis,
    "Data Kontak Erat": close_contact_name.toString(),
    "Dari Luar Negeri": this_.is_went_abroad ? ANSWER.YA : ANSWER.TIDAK,
    "Negara Yang Dikunjungi": this_.travelling_visited,
    "Tanggal Mulai Perjalanan": travelDate,
    "Tanggal Pulang Perjalanan": travelArrive,
    "Dari Luar Kota": this_.is_went_other_city ? ANSWER.YA : ANSWER.TIDAK,
    "Kota Yang Dikunjungi": this_.travelling_visited,
    "Tanggal Mulai Perjalanan": travelDate,
    "Tanggal Pulang Perjalanan": travelArrive,
    "Kontak Dengan Kasus Suspek ": this_.close_contact_criteria,
    "Kontak Dengan Nama Kasus Suspek": this_.close_contact_name,
    "Kontak Dengan Kasus Konfirmasi": this_.close_contacted_before_sick_14_days ? ANSWER.YA : ANSWER.TIDAK,
    "Mengunjungi Tempat Publik": this_.has_visited_public_place ? ANSWER.YA : ANSWER.TIDAK,
    "Nama Lokasi Tempat Publik": this_.public_place_name,
    "Tgl Kunjungan Ke Tempat Publik": this_.public_place_date_visited,
    "Kelompok ISPA Berat": this_.close_contact_heavy_ispa_group ? ANSWER.YA : ANSWER.TIDAK,
    "Petugas Kesehatan": this_.close_contact_health_worker ? ANSWER.YA : ANSWER.TIDAK,
    "Alat Pelindung yang Digunakan": apdUse,
    "Merokok": helpers.convertYesOrNO(this_.smoking),
    "Konsumsi Alkohol": helpers.convertYesOrNO(this_.consume_alcohol),
    "Aktifitas Fisik": helpers.convertPysichal(this_.pysichal_activity),
    "Penghasilan": helpers.convertIncome(this_.income),
    "Tanggal Input": createdDate,
    "Tanggal Update Riwayat": updatedDate,
    "Author": this_.author
  }
}

const sqlCondition = (params, search) => {
  return [
    {
      $match: {
        $and : [ params ],
        $or : [ search ]
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
    },{
      $lookup: {
        from: "closecontacts",
        localField: "_id",
        foreignField: "case",
        as: "close_contact_list"
      },
    },{ $sort: { "history_list._id": -1, "cases._id": -1 } },
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
        "current_location_address": "$history_list.current_location_address",
        "there_are_symptoms": "$history_list.there_are_symptoms",
        "first_symptom_date": "$history_list.first_symptom_date",
        "diagnosis": "$history_list.diagnosis",
        "diseases": "$history_list.diseases",
        "diagnosis_ards": "$history_list.diagnosis_ards",
        "diagnosis_pneumonia": "$history_list.diagnosis_pneumonia",
        "other_diagnosis": "$history_list.other_diagnosis",
        "is_went_abroad": "$is_went_abroad",
        "diagnosis_pneumonia": "$history_list.diagnosis_pneumonia",
        "travelling_visited": "$history_list.travelling_history.travelling_visited",
        "travelling_date": "$history_list.travelling_history.travelling_date",
        "travelling_arrive": "$history_list.travelling_arrive",
        "is_went_other_city": "$history_list.is_went_other_city",
        "close_contact_list": "$close_contact_list",
        "close_contact_criteria": "$history_list.close_contact_premier.close_contact_criteria",
        "close_contact_name": "$history_list.close_contact_premier.close_contact_name",
        "close_contacted_before_sick_14_days": "$close_contacted_before_sick_14_days",
        "has_visited_public_place": "$history_list.has_visited_public_place",
        "public_place_name": "$history_list.visited_public_place.public_place_name",
        "public_place_date_visited": "$history_list.visited_public_place.public_place_date_visited",
        "close_contact_heavy_ispa_group": "$close_contact_heavy_ispa_group",
        "close_contact_health_worker": "$close_contact_health_worker",
        "apd_use": "$apd_use",
        "smoking": "$smoking",
        "consume_alcohol": "$consume_alcohol",
        "pysichal_activity": "$pysichal_activity",
        "income": "$income",
        "createdAt": "$author_list.createdAt",
        "updatedAt": "$author_list.updatedAt",
        "author": "$author_list.fullname"
      }
    }
  ]
}

module.exports = {
  excellOutput, sqlCondition
}