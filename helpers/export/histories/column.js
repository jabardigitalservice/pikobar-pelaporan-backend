const helpers = require("../../custom")
const { GENDER } = require("../../constant")
const sectionIdentity = (this_) => {
  let birthDate = this_.birth_date ? helpers.convertDate(this_.birth_date) : null
  let finals = helpers.patientStatus(this_.final_result)
  let criteria = helpers.criteriaConvert(this_.status)
  const address = helpers.checkExistColumn(this_.address_street)
  return{
    "Nama Pasien": this_.name,
    "NIK": this_.nik,
    "Alasan tidak ada NIK": helpers.checkExistColumn(this_.note_nik),
    "No Telepon": helpers.checkExistColumn(this_.phone_number),
    "Alasan Tidak Ada No Telepon": helpers.checkExistColumn(this_.note_phone_number),
    "Tempat Lahir": this_.place_of_birth,
    "Tanggal Lahir": birthDate,
    "Usia Tahun": Math.floor(this_.age),
    "Usia Bulan": Math.ceil((this_.age - Math.floor(this_.age)) * 12),
    "Jenis Kelamin": this_.gender === "L" ? GENDER.ID_L : GENDER.ID_P,
    "Kota/Kab": this_.address_district_name,
    "Kecamatan": this_.address_subdistrict_name,
    "Kel/Desa": this_.address_village_name,
    "Alamat Lengkap (RT/RW)": `${address} (${helpers.checkExistColumn(this_.rt)}/${ helpers.checkExistColumn(this_.rw)})`,
    "Pekerjaan": this_.occupation,
    "Alamat Kantor": this_.office_address,
    "Kewarganegaraan": this_.nationality === "WNI" ? "Indonesia" : this_.nationality_name,
    "Kriteria": criteria,
    "Status Pasien Terakhir": finals
  }
}

const sectionClinic = (this_) => {
  let symptomsDate = this_.first_symptom_date ? helpers.convertDate(this_.first_symptom_date) : null
  let lastDate = this_.last_date_status_patient ? helpers.convertDate(this_.last_date_status_patient) : null
  let patientLocation = helpers.locationPatient(this_.current_location_type, this_.current_location_address)
  return{
    "Tgl Update Status Pasien Terakhir": lastDate,
    "Dirawat di Rumah Sakit ?": patientLocation.bool,
    "Nama Rumah Sakit": patientLocation.location_name,
    "Tanggal Gejala": symptomsDate,
  }
}

const sectionOthers = (this_) => {
  let createdDate = this_.createdAt ? helpers.convertDate(this_.createdAt) : null
  return{
    "Kondisi Penyerta Lainnya": this_.diseases_other,
    "Diagnosis ARDS": helpers.convertYesOrNO(this_.diagnosis_ards),
    "Diagnosis Pneumonia": helpers.convertYesOrNO(this_.diagnosis_pneumonia),
    "Diagnosis Lainnya": this_.other_diagnosis,
    "Etiologi": helpers.yesOrNoBool(this_.is_other_diagnosisr_respiratory_disease),
    "Sebutkan Etiologi Lainnya": this_.other_diagnosisr_respiratory_disease,
    "Merokok": helpers.convertYesOrNO(this_.smoking),
    "Konsumsi Alkohol": helpers.convertYesOrNO(this_.consume_alcohol),
    "Author": this_.author,
    "Tanggal Input": createdDate,
  }
}

const combineInfo = (this_) => {
  return {
    ...sectionIdentity(this_),
    ...sectionClinic(this_)
  }
}


module.exports = {
  combineInfo, sectionOthers
}