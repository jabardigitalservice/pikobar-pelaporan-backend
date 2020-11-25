const helpers = require("../../custom")
const { GENDER, ANSWER } = require("../../constant")
const sectionIdentity = (this_) => {
  let birthDate = this_.birth_date ? helpers.convertDate(this_.birth_date) : null
  let interviewDate = this_.interviewers_date ? helpers.convertDate(this_.interviewers_date) : null
  return{
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
    "Kel/Desa": this_.address_village_name
  }
}

const sectionInfo = (this_) => {
  let finals = helpers.patientStatus(this_.final_result)
  let criteria = helpers.criteriaConvert(this_.status)
  let symptomsDate = this_.first_symptom_date ? helpers.convertDate(this_.first_symptom_date) : null
  let lastDate = this_.last_date_status_patient ? helpers.convertDate(this_.last_date_status_patient) : null
  let patientLocation = helpers.locationPatient(this_.current_location_type, this_.current_location_address)
  return {
    "Alamat Lengkap (RT/RW)": `${helpers.checkExistColumn(this_.address_street)}`,
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
    "Tanggal Gejala": symptomsDate
  }
}

const sectionClinic = (this_) => {
  let updatedDate = this_.updatedAt ? helpers.convertDate(this_.updatedAt) : null
  let createdDate = this_.createdAt ? helpers.convertDate(this_.createdAt) : null
  let apdUse = this_.apd_use ? this_.apd_use.toString() : null
  return{
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
    "Tanggal Input": createdDate
  }
}

module.exports = {
  sectionIdentity, sectionInfo, sectionClinic
}