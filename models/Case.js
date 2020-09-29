const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')

const sectionFlagStatus = {
  status_sect_identity: { type: Number, default: 0 },
  status_sect_clinical: { type: Number, default: 0 },
  status_sect_inspection: { type: Number, default: 0 },
  status_sect_travel: { type: Number, default: 0 },
  status_sect_economy: { type: Number, default: 0 },
  status_sect_exposure: { type: Number, default: 0 },
  status_sect_closecontact: { type: Number, default: 0 },
  is_data_completed: { type: Boolean, default: false },
}

const refRelatedCase = [{
  _id: false,
  id_case: { type: String, default: null },
  id_case_registrant: { type: String, default: null },
  is_west_java: { type: Boolean, default: true },
  status: { type: String, default: null },
  relation: { type: String, default: null },
  relation_others: { type: String, default: null },
  activity: { type: Array, default: [] },
  activity_others: { type: String, default: null },
  first_contact_date: { type: Date, default: null },
  last_contact_date: { type: Date, default: null },
  is_access_granted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
}]

const CaseSchema = new mongoose.Schema({
  // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
  id_case: { type: String, lowercase: true, unique: true, index: true },
  // NIK sumber terkait kontak erat
  id_case_national: { type: String },
  is_nik_exists: { type: Boolean, default: false },
  nik: { type: String },
  note_nik: { type: String },
  id_case_related: { type: String },
  name_case_related: { type: String },
  name: { type: String },
  name_parents: { type: String, default: null },
  interviewers_name: { type: String, default: null },
  interviewers_phone_number: { type: String, default: null },
  interview_date: { type: Date, default: Date.now() },
  // tentatif jika diisi usia, required jika tidak
  place_of_birth: { type: String, default: null },
  birth_date: { type: Date },
  age: { type: Number },
  month: { type: Number },
  gender: { type: String },
  is_patient_address_same: { type: Boolean, default: false },
  address_street: { type: String }, // alamat lengkap
  address_village_code: { type: String, required: [true, "can't be blank"] },
  address_village_name: { type: String, required: [true, "can't be blank"] },
  // kecamatan
  address_subdistrict_code: { type: String, required: [true, "can't be blank"] },
  address_subdistrict_name: { type: String, required: [true, "can't be blank"] },
  // kab/kota
  address_district_code: { type: String, required: [true, "can't be blank"] },
  address_district_name: { type: String, required: [true, "can't be blank"] },
  address_province_code: { type: String, default: 32 },
  address_province_name: { type: String, default: "Jawa Barat" },
  rt: { type: Number, default: null },
  rw: { type: Number, default: null },
  latitude: { type: String, default: null },
  longitude: { type: String, default: null },
  office_address: { type: String },
  is_phone_number_exists: { type: Boolean, default: false },
  phone_number: { type: String },
  note_phone_number: { type: String },
  nationality: { type: String },
  nationality_name: { type: String },
  occupation: { type: String },
  last_history: { type: mongoose.Schema.Types.ObjectId, ref: 'History' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author_district_code: { type: String },
  author_district_name: { type: String },
  stage: String,
  status: String,
  final_result: { type: String, required: [true, "can't be blank"], default: null },
  last_date_status_patient: { type: Date, default: Date.now() },
  delete_status: String,
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // social history
  pysichal_activity: { type: Number, default: null },
  smoking: { type: Number, default: null }, // 1 ya 2 tidak 3 tidak tahu
  consume_alcohol: { type: Number, default: null }, // 1 ya 2 tidak 3 tidak tahu
  income: { type: Number, default: null },
  //verifikasi status
  verified_status: { type: String, lowercase: true },
  verified_comment: { type: String, default: null },
  transfer_status: { type: String, lowercase: true, default: null },
  transfer_to_unit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
  latest_faskes_unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
  is_test_masif: { type: Boolean, default: false },
  input_source: String,
  // untuk kebutuhan laporan harian
  there_are_symptoms: { type: Boolean, default: false },
  //medical officer
  fasyankes_type: { type: String, default: null },
  fasyankes_code: { type: String, default: null },
  fasyankes_name: { type: String, default: null },
  fasyankes_province_code: { type: String, default: "32" },
  fasyankes_province_name: { type: String, default: "Jawa Barat" },
  fasyankes_subdistrict_code: { type: String, default: null },
  fasyankes_subdistrict_name: { type: String, default: null },
  fasyankes_village_code: { type: String, default: null },
  fasyankes_village_name: { type: String, default: null },
  assignment_place: { type: String, default: null }, //tempat tugas bisa diisi unit kerja
  //faktor kontak paparan
  close_contacted_before_sick_14_days: { type: Boolean, default: false },
  close_contact_parents: refRelatedCase, // denormalization purpose
  close_contact_childs: refRelatedCase, // denormalization purpose
  close_contact_heavy_ispa_group: { type: Boolean, default: false },
  close_contact_have_pets: { type: Boolean, default: false },
  close_contact_pets: { type: String, default: null },
  close_contact_health_worker: { type: Boolean, default: false },
  apd_use: { type: Array, default: [] },
  close_contact_performing_aerosol_procedures: { type: Boolean, default: false },
  close_contact_performing_aerosol: { type: String, default: null },
  //pemeriksaan penunjang
  physical_check_temperature: { type: Number, default: 0 },
  physical_check_blood_pressure: { type: Number, default: 0 },
  physical_check_pulse: { type: Number, default: 0 },
  physical_check_respiration: { type: Number, default: 0 },
  physical_check_height: { type: Number, default: 0 },
  physical_check_weight: { type: Number, default: 0 },
  inspection_support: [{
    inspection_type: { type: String, default: null },
    specimens_type: { type: String, default: null },
    inspection_date: { type: Date, default: '' },
    inspection_location: { type: String, default: null },
    get_specimens_to: { type: Number, default: 0 },
    inspection_result: { type: String, default: null }
  }],
  //faktor riwayat perjalanan
  has_visited_public_place: { type: Boolean, default: false },
  visited_public_place: [{
    public_place_category: { type: String, default: null },
    public_place_name: { type: String, default: null },
    public_place_address: { type: String, default: null },
    public_place_date_visited: { type: Date, default: '' },
    public_place_duration_visited: { type: String, default: null }
  }],
  travelling_history_before_sick_14_days: { type: Boolean, default: false },
  travelling_history: [{
    travelling_type: { type: String, default: null },
    travelling_visited: { type: String, default: null },
    travelling_city: { type: String, default: null },
    travelling_date: { type: Date, default: '' },
    travelling_arrive: { type: Date, default: '' }
  }],
  visited_local_area_before_sick_14_days: { type: Boolean, default: false },
  visited_local_area: [{
    visited_local_area_province: { type: String, default: null },
    visited_local_area_city: { type: String, default: null },
  }],
  is_reported: { type: Boolean, default: true },
  origin_closecontact: { type: Boolean, default: false },
  ...sectionFlagStatus,
}, { timestamps: true, usePushEach: true })

CaseSchema.index({ author: 1 });
CaseSchema.index({ transfer_status: 1 });
CaseSchema.index({ transfer_to_unit_id: 1 });
CaseSchema.index({ verified_status: 1 });
CaseSchema.index({ address_district_code: 1 });
CaseSchema.plugin(mongoosePaginate);
CaseSchema.plugin(aggregatePaginate);
CaseSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' });
CaseSchema.methods.toJSONFor = function () {
  return {
    _id: this._id,
    id_case: this.id_case,
    name: this.name,
    age: this.age,
    nik: this.nik,
    nationality: this.nationality,
    nationality_name: this.nationality_name,
    gender: this.gender,
    address_district_name: this.address_district_name,
    address_district_code: this.address_district_code,
    phone_number: this.phone_number,
    stage: this.stage,
    status: this.status,
    verified_status: this.verified_status,
    verified_comment: this.verified_comment,
    transfer_status: this.transfer_status || null,
    final_result: this.final_result,
    delete_status: this.delete_status,
    deletedAt: this.deletedAt,
    author: this.author.JSONCase(),
    last_history: this.last_history,
    is_test_masif: this.is_test_masif,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

CaseSchema.methods.JSONFormCase = function () {
  let covid = this.id_case
  let nik = this.nik === null || this.nik === undefined ? "-" : this.nik
  let phone_number = this.phone_number === null || this.phone_number === undefined ? "-" : this.phone_number
  return {
    display: this.name + '/' + nik + '/' + phone_number,
    id_case: this.id_case,
    last_status: this.status,
    source_data: "internal"
  }
}

CaseSchema.methods.JSONFormIdCase = function () {
  return {
    _id: this._id,
    id_case: this.id_case,
    name: this.name,
    relateds: `${this.name} (${this.id_case})`
  }
}

CaseSchema.methods.JSONSeacrhOutput = function () {
  return {
    id: this._id,
    id_case: this.id_case,
    target: this.target,
    nik: this.nik,
    name: this.name,
    birth_date: this.birth_date,
    age: this.age,
    gender: this.gender,
    address_detail: this.address_street,
    address_district_code: this.address_district_code,
    address_district_name: this.address_district_name,
    address_subdistrict_code: this.address_subdistrict_code,
    address_subdistrict_name: this.address_subdistrict_name,
    address_village_code: this.address_village_code,
    address_village_name: this.address_village_name,
    phone_number: this.phone_number,
    category: this.category,
    mechanism: null,
    nationality: this.nationality,
    nationality_name: this.nationality_name,
    final_result: this.final_result,
    test_location_type: null,
    test_location: null,
    status: this.status,
    source_data: "internal"
  }
}

/*
 * If case deleted,
 * Set 'is_case_deleted' in the CloseContact documents to TRUE
*/
CaseSchema.pre('save', async function (next) {
  const CloseContact = new mongoose.models["CloseContact"]
  if (this.delete_status === 'deleted') {
    await CloseContact.onDeleteCase(this._id)
  }
  next()
})

module.exports = mongoose.model('Case', CaseSchema)
