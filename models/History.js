const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const HistorySchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case'},
    status : { type: String, uppercase: true, required: [true, "can't be blank"]}, //  ODP / PDP / POSITIF
    stage : { type: String, uppercase: true , default: null}, // PROSES / SELESAI
    final_result : { type: String, uppercase: true, required: [true, "can't be blank"], default: null}, // NEGATIF / MENINGGAL / SEMBUH
    diagnosis : { type: Array, default: [] },
    diagnosis_other : String,
    diseases : { type: Array, default: [] }, // Kondisi/Penyakit penyerta
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
    current_location_type: { type: String, uppercase: true, required: [true, "can't be blank"]},  //[RS, RUMAH, OTHERS]
    // nama rumah sakit kalau di rumah sakit, nama kecamatan kalau di tempat tinggal
    is_patient_address_same: { type: Boolean, default: false },
    current_hospital_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default:null},
    current_hospital_type: { type: String, default: null },
    current_location_address: String, // or Number?
    current_location_village_code : String,
    current_location_subdistrict_code : String, //kecamatan
    current_location_district_code : String, //kab/kota
    current_location_province_code : {type: String, default: "32"},
    diagnosis_ards : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    diagnosis_covid : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    diagnosis_pneumonia : { type: Number, default: null}, // 1 ya 2 tidak 3 tidak tahu
    other_diagnosis: String,
    there_are_symptoms :  { type: Boolean, default: false},
    is_other_diagnosisr_respiratory_disease: {type: Boolean, default: false},
    other_diagnosisr_respiratory_disease: String,
    pysichal_activity: { type: Number, default: null },
    smoking: { type: Number, default: null }, // 1 ya 2 tidak 3 tidak tahu
    consume_alcohol: { type: Number, default: null }, // 1 ya 2 tidak 3 tidak tahu
    physical_check_temperature: { type: Number, default: 0 },
    physical_check_blood_pressure: { type: Number, default: 0 },
    physical_check_pulse: { type: Number, default: 0 },
    physical_check_respiration: { type: Number, default: 0 },
    physical_check_height: { type: Number, default: 0 },
    physical_check_weight: { type: Number, default: 0 },
}, { timestamps : true });

HistorySchema.index({case: 1});

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
        is_patient_address_same: this.is_patient_address_same,
        current_location_type: this.current_location_type,
        current_hospital_id: this.current_hospital_id,
        current_hospital_type: this.current_hospital_type,
        current_location_address : this.current_location_address,
        current_location_district_code : this.current_location_district_code,
        current_location_subdistrict_code : this.current_location_subdistrict_code,
        current_location_village_code : this.current_location_village_code,
        current_location_province_code : this.current_location_province_code,
        diagnosis_ards : this.diagnosis_ards,
        diagnosis_covid : this.diagnosis_covid,
        diagnosis_pneumonia : this.diagnosis_pneumonia,
        other_diagnosis: this.other_diagnosis,
        pysichal_activity: this.pysichal_activity,
        smoking: this.smoking,
        consume_alcohol: this.consume_alcohol,
        physical_check_temperature: this.physical_check_temperature,
        physical_check_blood_pressure: this.physical_check_blood_pressure,
        physical_check_pulse: this.physical_check_pulse,
        physical_check_respiration: this.physical_check_respiration,
        physical_check_height: this.physical_check_height,
        physical_check_weight: this.physical_check_weight,
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
HistorySchema.plugin(mongoosePaginate);
HistorySchema.pre('save', async function (next) {

  try {
    const hospitalId = this.current_hospital_id
    if (!hospitalId) return

    const unit = await mongoose.models["Unit"]
      .findById(hospitalId)
      .select('rs_type')

    if (!unit || !unit.rs_type) return

    const source = {
      current_hospital_type: unit.rs_type
    }

    Object.assign(this, source)

  } catch (e) {
    throw new Error(e)
  }

  next()
})

module.exports = mongoose.model('History', HistorySchema)
