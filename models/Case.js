const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, index: true},
    // NIK sumber terkait kontak erat
    id_case_national : {type:String},
    is_nik_exists: { type: Boolean, default: false },
    nik : { type:String},
    note_nik: {type: String},
    id_case_related : {type:String},
    name_case_related : {type:String},
    name: {type:String},
    name_parents: {type:String, default: null},
    interviewers_name: {type:String,default: null},
    interviewers_phone_number: {type:String,default: null},
    interview_date: { type: Date , default: Date.now()},
    // tentatif jika diisi usia, required jika tidak
    place_of_birth: {type: String, default: null},
    birth_date : { type: Date},
    age : {type:Number},
    month : {type:Number},
    gender : {type:String},
    is_patient_address_same: { type: Boolean, default: false },
    address_street: {type:String},
    address_village_code: { type: String, required: [true, "can't be blank"]},
    address_village_name: { type: String, required: [true, "can't be blank"]},
    // kecamatan
    address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    address_subdistrict_name: { type: String, required: [true, "can't be blank"]},
    // kab/kota
    address_district_code: { type: String, required: [true, "can't be blank"]},
    address_district_name: { type: String, required: [true, "can't be blank"]},
    address_province_code: { type: String, default:32},
    address_province_name: { type: String, default:"Jawa Barat"},
    rt: { type: Number, default:null},
    rw: { type: Number, default:null},
    office_address: {type:String},
    is_phone_number_exists: { type: Boolean, default: false },
    phone_number: {type:String},
    note_phone_number: {type: String},
    nationality: {type:String},
    nationality_name: {type: String},
    occupation: {type:String},
    last_history : {type: mongoose.Schema.Types.ObjectId, ref: 'History'},
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author_district_code : { type:String},
    author_district_name : { type: String},
    stage: String,
    status: String,
    final_result: {type: String, required: [true, "can't be blank"], default: null},
    last_date_status_patient: {type:Date, default:Date.now()},
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // social history
    pysichal_activity: {type: Number, default: null},
    smoking : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    consume_alcohol : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    income : { type: Number, default: null},
    //faktor kontak
    travel:{type:Number},
    travel_is_went_abroad: { type: Number, default: 0 }, //1 luar negeri 2 indonesia
    visited:{type:String,default:null},
    start_travel:{type:Date,default:Date.now()},
    end_travel:{type:Date,default:Date.now()},
    close_contact:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    id_close_contact : {type:String},
    name_close_contact : {type:String},
    close_contact_confirm:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    id_close_contact_confirm : {type:String},
    name_close_contact_confirm: {type:String},
    close_contact_animal_market:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    animal_market_date: { type: Date , default: null},
    animal_market_other: { type: String , default: null},
    close_contact_public_place:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    public_place_date: { type: Date , default: null},
    public_place_other: { type: String , default: null},
    close_contact_medical_facility:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    medical_facility_date: { type: Date , default: null},
    medical_facility_other: { type: String, default: null},
    close_contact_heavy_ispa_group:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    close_contact_health_worker:{type:Number}, // 1 ya 2 tidak 3 tidak tahu
    health_workers : { type: String, lowercase: true },
    apd_use:{type:Array,default:[]}, // 1 ya 2 tidak 3 tidak tahu
    verified_status: { type: String, lowercase: true },
    verified_comment: {type: String, default: null},
    transfer_status: { type: String, lowercase: true, default: null },
    transfer_to_unit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
    latest_faskes_unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
    is_test_masif: {type: Boolean, default: false},
    input_source: String,
     // untuk kebutuhan laporan harian
    there_are_symptoms :  { type: Boolean, default: false},
    //medical officer
    fasyankes_type: {type: String, default: null},
    fasyankes_code: {type: String, default: null},
    fasyankes_name: {type: String, default: null},
    fasyankes_province_code: {type: String, default: "32"},
    fasyankes_province_name: {type: String, default: "Jawa Barat"},
    fasyankes_subdistrict_code: {type: String, default:null},
    fasyankes_subdistrict_name: {type: String, default:null},
    fasyankes_village_code: {type: String, default:null},
    fasyankes_village_name: {type: String, default:null},
    assignment_place : {type:String, default:null} //tempat tugas bisa diisi unit kerja
},{ timestamps:true, usePushEach: true })

CaseSchema.index({author: 1});
CaseSchema.index({transfer_status: 1});
CaseSchema.index({transfer_to_unit_id: 1});
CaseSchema.index({verified_status: 1});
CaseSchema.index({address_district_code: 1});
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
        createdAt : this.createdAt,
        updatedAt : this.updatedAt
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

module.exports = mongoose.model('Case', CaseSchema);
