const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    status : { type: String, uppercase: true, required: [true, "can't be blank"]}, //  ODP / PDP / POSITIF
    stage : { type: String, uppercase: true, required: [true, "can't be blank"]}, // PROSES / SELESAI
    final_result : { type: String, uppercase: true, default: null}, // NEGATIF / MENINGGAL / SEMBUH
    diagnosis : Array,
    diagnosis_other : String,
    diseases : Array, // Kondisi/Penyakit penyerta
    diseases_other : String,
    last_changed : { type: Date, default: Date.now }, // waktu terjadinya perubahan, isi manual
    // riwayat perjalanan/kontak dengan pasien positif
    is_went_abroad : Boolean,
    visited_country : String,
    return_date : Date,
    is_went_other_city : Boolean,
    visited_city : String,
    is_contact_with_positive : Boolean,
    history_notes: String,
    is_sample_taken : Boolean,

    report_source : { type: String, default: null },
    first_symptom_date : {type : Date, default: Date.now()},

    other_notes: String,
    // current_location mandatory ketika pilih PDP atau Positif, option ketika ODP -> lokasi saat ini
    current_location_type: String,  // RS / RUMAH
    // nama rumah sakit kalau di rumah sakit, nama kecamatan kalau di tempat tinggal
    current_hospital_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Unit'},
    current_location_address: String, // or Number?
    current_location_village_code : String,
    current_location_subdistrict_code : String, //kecamatan
    current_location_district_code : String, //kab/kota
    current_location_province_code : {type: String, default: "32"},
}, { timestamps : true });

HistorySchema.methods.toJSONFor = function () {
    return {
        case: this.case,
        status : this.status,
        stage : this.stage,
        final_result : this.final_result,
        diagnosis : this.diagnosis,
        diagnosis_other : this.diagnosis_other,
        diseases : this.diseases,
        diseases_other : this.diseases_other,
        last_changed: this.last_changed,

        is_went_abroad : this.is_went_abroad,
        visited_country : this.visited_country,
        return_date : this.return_date,
        is_went_other_city : this.is_went_other_city,
        visited_city : this.visited_city,
        is_contact_with_positive : this.is_contact_with_positive,
        history_notes: this.history_notes,
        is_sample_taken : this.is_sample_taken,

        report_source : this.report_source,
        first_symptom_date : this.first_symptom_date,
        other_notes: this.other_notes,

        current_location_type: this.current_location_type,
        current_hospital_id: this.current_hospital_id,
        current_location_address : this.current_location_address,
        current_location_district_code : this.current_location_district_code,
        current_location_subdistrict_code : this.current_location_subdistrict_code,
        current_location_village_code : this.current_location_village_code,
        current_location_province_code : this.current_location_province_code,
        createdAt : this.createdAt,
        updatedAt : this.updatedAt
    }
}

HistorySchema.methods.JSONCaseTransfer = function () {
    return {
        status : this.status,
        stage : this.stage,
        final_result : this.final_result
    }
}

module.exports = mongoose.model('History', HistorySchema)
