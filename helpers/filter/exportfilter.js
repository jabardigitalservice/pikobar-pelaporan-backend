const helpers = require("../custom")
const { GENDER } = require("../constant")

const excellOutput = (this_) => {
  let finals = helpers.patientStatus(this_)
  let criteria = helpers.criteriaConvert(this_)
  let birthDate = this_.birth_date != null ? helpers.convertDate(this_.birth_date) : null
  let updatedDate = this_.updatedAt != null ? helpers.convertDate(this_.updatedAt) : null
  let createdDate = this_.createdAt != null ? helpers.convertDate(this_.createdAt) : null
  let interviewDate = this_.interview_date != null ? helpers.convertDate(this_.interview_date) : null
  let symptomsDate = this_.first_symptom_date != null ? helpers.convertDate(this_.first_symptom_date) : null
  let diagnosis = this_.history_list[0].diagnosis.toString()
  let diagnosisOther = this_.history_list[0].diseases.toString()
  let apdUse = this_.apd_use.toString()

  return {
    "Nama Pewawancara": this_.interviewers_name,
    "No HP Pewawancara": this_.interviewers_phone_number,
    "Tanggal Wawancara": interviewDate,
    "Nama Pasien": this_.name,
    "NIK": this_.nik,
    "Alasan tidak ada NIK": this_.note_nik,
    "No Telepon": this_.phone_number,
    "Alasan Tidak Ada No Telepon": this_.note_phone_number,
    "Nama Orangtua": this_.name_parents,
    "Tempat Lahir": this_.place_of_birth,
    "Tanggal Lahir": birthDate,
    "Usia Tahun": this_.age,
    "Usia Bulan": this_.month,
    "Jenis Kelamin": this_.gender === "L" ? GENDER.INDO_L : GENDER.INDO_P,
    "Kota/Kab": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kel/Desa": this_.address_village_name,
    "Alamat Lengkap (RT/RW)": `${this_.address_street} (${this_.rt}/${this_.rw})`,
    "Pekerjaan": this_.occupation,
    "Alamat Kantor": this_.office_address,
    "Kewarganegaraan": this_.nationality == "WNI" ? "Indonesia" : this_.nationality_name,
    "Kriteria": criteria,
    "Status Pasien Terakhir": finals,
    "Lokasi Saat Ini": this_.history_list[0] !== null ? this_.history_list[0].current_location_address : null,
    "Terdapat Gejala": this_.history_list[0].there_are_symptoms ? "Ya" : "Tidak",
    "Tanggal Muncul Gejala": symptomsDate,
    "Gejala": diagnosis,
    "Kondisi Penyerta": diagnosisOther,
    "Diagnosis ARDS": helpers.convertYesOrNO(this_.history_list[0].diagnosis_ards),
    "Diagnosis Pneumonia": helpers.convertYesOrNO(this_.history_list[0].diagnosis_pneumonia),
    "Diagnosis Lainnya": this_.history_list[0].other_diagnosis,
    // "Data Kontak Erat": this_.close_contact_premier.close_contact_name,
    "Dari Luar Negeri": this_.is_went_abroad ? "Ya" : "Tidak",
    // "Negara Yang Dikunjungi": this_.history_list[0].travelling_history.travelling_visited,
    // "Tanggal Mulai Perjalanan": this_.history_list[0].travelling_history.travelling_date,
    // "Tanggal Pulang Perjalanan": this_.history_list[0].travelling_history.travelling_arrive,
    "Dari Luar Kota": this_.history_list[0].is_went_other_city ? "Ya" : "Tidak",
    // "Kota Yang Dikunjungi": this_.id_case,
    // "Tanggal Mulai Perjalanan": this_.id_case,
    // "Tanggal Pulang Perjalanan": this_.id_case,
    // "Kontak Dengan Kasus Suspek ": this_.id_case,
    // "Kontak Dengan Nama Kasus Suspek": this_.id_case,
    "Kontak Dengan Kasus Konfirmasi": this_.close_contacted_before_sick_14_days ? "Ya" : "Tidak",
    // "Mengunjungi Pasar Hewan": this_.id_case, di takeout gak ada di database
    // "Nama Lokasi Pasar Hewan": this_.id_case,
    // "Tgl Kunjungan Ke Pasar Hewan": this_.id_case,
    // "Mengunjungi Tempat Publik": this_.history_list[0].has_visited_public_place ? "Ya" : "Tidak",
    // "Nama Lokasi Tempat Publik": this_.history_list[0].visited_public_place.public_place_name,
    // "Tgl Kunjungan Ke Tempat Publik": this_.history_list[0].visited_public_place.public_place_date_visited ? "Ya" : "Tidak" ,
    "Kelompok ISPA Berat": this_.close_contact_heavy_ispa_group ? "Ya" : "Tidak",
    "Petugas Kesehatan": this_.close_contact_health_worker ? "Ya" : "Tidak",
    "Alat Pelindung yang Digunakan": apdUse,
    // "Pemeriksaan Serum": this_.id_case, // di takeout gak ada di database
    // "Pemeriksaan Sputum": this_.id_case,
    // "Pemeriksaan Swab Nasofaring/Orofaring": this_.id_case,
    "Merokok": helpers.convertYesOrNO(this_.smoking),
    "Konsumsi Alkohol": helpers.convertYesOrNO(this_.consume_alcohol),
    "Aktifitas Fisik": helpers.convertPysichal(this_.pysichal_activity),
    "Penghasilan": helpers.convertIncome(this_.income),
    "Tanggal Input": createdDate,
    "Tanggal Update Riwayat": updatedDate,
    "Author": this_.author_list[0].fullname
  }
}

const sqlCondition = (params, search) => {
  return [
    {
      $match: {
        $and : [ params ],
        $or : search
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
    },{ $sort: {"history_list._id": -1} },
  ]
}

module.exports = {
  excellOutput, sqlCondition
}