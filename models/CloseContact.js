const mongoose = require('mongoose')
const consts = require('../helpers/constant')
const mongoosePaginate = require('mongoose-paginate-v2');

const REF_CASE = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
}
const REF_CLOSE_CONTACT_HISTORY = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactHistory',
    default: null
}
const REF_USER = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
}

const CloseContactSchema = new mongoose.Schema({
    case: REF_CASE,
    interviewer_name: { type: String, default: null },
    contact_tracing_date: { type: Date, default: Date.now() },
    is_nik_exists: { type: Boolean, default: false },
    nik : { type: String, default: null },
    nik_note : { type: String, default: null },
    name : { type: String, default: null },
    is_phone_number_exists: { type: Boolean, default: false },
    phone_number : { type: String, default: null },
    phone_number_note : { type: String, default: null },
    birth_date : { type: Date, default: null },
    age : { type: Number, default: 0 },
    month : { type:Number, default: 0 },
    gender: { type: String, default: null },
    is_patient_address_same: { type: Boolean, default: false },
    address_province_code: { type: String, default: consts.DEFAULT_PROVINCE.CODE },
    address_province_name: { type: String, default: consts.DEFAULT_PROVINCE.NAME },
    address_district_code: { type: String, default: null },
    address_district_name: { type: String, default: null },
    address_subdistrict_code: { type: String, default: null },
    address_subdistrict_name: { type: String, default: null },
    address_village_code: { type: String, default: null },
    address_village_name: { type: String, default: null },
    address_rw: { type: String, default: null },
    address_rt: { type: String, default: null },
    address_street: { type: String, default: null },
    relationship: { type: String, default: null },
    relationship_other: { type: String, default: null },
    activity: { type: Array, default: [] }, // berubah yang tadinya string jadi array
    activity_other: String, // aktifitas lainnya
    emergency_contact_name: { type: String, default: null },
    emergency_contact_phone: { type: String, default: null },
    emergency_contact_relationship: { type: String, default: null },
    travel_is_went_abroad: { type: Boolean, default: false },
    travel_visited_country: { type: String, default: null },
    travel_country_depart_date: { type: Date, default: null },
    travel_country_return_date: { type: Date, default: null },
    travel_is_went_other_city : { type: Boolean, default: false },
    travel_visited_city : { type: String, default: null },
    travel_city_depart_date : { type: Date, default: null },
    travel_city_return_date : { type: Date, default: null },
    travel_occupation: { type: String, default: null },
    travel_address_office: { type: String, default: null },
    travel_transportations: { type: Array, default: [] },
    contact_type: { type: Number, default: 0 },
    contact_place: { type: Number, default: 0 },
    contact_date: { type: Date, default: null },
    contact_durations: { type: Number, default: 0 },
    start_contact_date: {type: Date, default: null},
    end_contact_date: {type: Date, default: null},
    home_contact_date: { type: Date, default: null },
    home_contact_days: { type: Number, default: 0 },
    home_contact_activities: { type: Array, default: [] },
    officer_is_contact: { type: Boolean, default: false },
    officer_protection_tools: { type: Array, default: [] },
    is_reported: { type: Boolean, default: false },
    is_case_deleted: { type: Boolean, default: false },
    latest_history : REF_CLOSE_CONTACT_HISTORY,
    createdBy: REF_USER,
    updatedBy: REF_USER,
    delete_status: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: REF_USER,
}, { timestamps : true });


CloseContactSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        case: this.case ? this.case.JSONFormIdCase() : null,
        interviewer_name: this.interviewer_name,
        contact_tracing_date: this.contact_tracing_date,
        is_nik_exists: this.is_nik_exists,
        nik : this.nik,
        nik_note : this.nik_note,
        name : this.name,
        is_phone_number_exists: this.is_phone_number_exists,
        phone_number : this.phone_number,
        phone_number_note : this.phone_number_note,
        birth_date : this.birth_date,
        age : this.age,
        month: this.month,
        gender: this.gender,
        is_patient_address_same: this.is_patient_address_same,
        address_province_code: this.address_province_code,
        address_province_name: this.address_province_name,
        address_district_code: this.address_district_code,
        address_district_name: this.address_district_name,
        address_subdistrict_code: this.address_subdistrict_code,
        address_subdistrict_name: this.address_subdistrict_name,
        address_village_code: this.address_village_code,
        address_village_name: this.address_village_name,
        address_rw: this.address_rw,
        address_rt: this.address_rt,
        address_street : this.address_street,
        relationship : this.relationship,
        relationship_other: this.relationship_other,
        activity: this.activity,
        activity_other: this.activity_other,
        start_contact_date: this.start_contact_date,
        end_contact_date: this.end_contact_date,
        emergency_contact_name: this.emergency_contact_name,
        emergency_contact_phone: this.emergency_contact_phone,
        emergency_contact_relationship: this.emergency_contact_relationship,
        travel_is_went_abroad: this.travel_is_went_abroad,
        travel_visited_country: this.travel_visited_country,
        travel_country_depart_date: this.travel_country_depart_date,
        travel_country_return_date: this.travel_country_return_date,
        travel_is_went_other_city : this.travel_is_went_other_city,
        travel_visited_city : this.travel_visited_city,
        travel_city_depart_date : this.travel_city_depart_date,
        travel_city_return_date : this.travel_city_return_date,
        travel_occupation: this.travel_occupation,
        travel_address_office: this.travel_address_office,
        travel_transportations: this.travel_transportations,
        contact_type: this.contact_type,
        contact_place: this.contact_place,
        contact_date: this.contact_date,
        contact_durations: this.contact_durations,
        home_contact_date: this.home_contact_date,
        home_contact_days: this.home_contact_days,
        home_contact_activities: this.home_contact_activities,
        officer_is_contact: this.officer_is_contact,
        officer_protection_tools: this.officer_protection_tools,
        is_reported: this.is_reported,
        latest_history : this.latest_history ? this.latest_history.toJSONFor() : null
    }
}

CloseContactSchema.methods.toJSONList = function () {
    return {
        _id: this._id,
        case: this.case ? this.case.JSONFormIdCase() : null,
        nik : this.nik,
        name : this.name,
        phone_number : this.phone_number,
        birth_date : this.birth_date,
        age : this.age,
        gender: this.gender,
        address_province_name: this.address_province_name,
        address_district_name: this.address_district_name,
        address_subdistrict_name: this.address_subdistrict_name,
        address_village_name: this.address_village_name,
        address_rw: this.address_rw,
        address_rt: this.address_rt,
        address_street: this.address_street,
        relationship: this.relationship,
        relationship_other: this.relationship_other,
        activity: this.activity,
        activity_other: this.activity_other,
        start_contact_date: this.start_contact_date,
        end_contact_date: this.end_contact_date,
        is_reported: this.is_reported,
        createdAt: this.createdAt,
        createdBy: this.createdBy ? this.createdBy.JSONCase() : null
    }
}

CloseContactSchema.methods.getByNik = function (nik) {
    return mongoose.models["CloseContact"]
        .findOne({ nik: nik })
        .where('delete_status').ne('deleted')
}

CloseContactSchema.methods.onDeleteCase = function (caseId) {
    return mongoose.models["CloseContact"]
        .updateMany(
            { case: caseId },
            { is_case_deleted: true }
        )
}

/*
 * REFERENCE: https://mongoosejs.com/docs/middleware.html#pre
 *
 * Only validate if NIK is set. (Allow Null/Empty string)
 * If using { unique: true }, NULL/Empty string will be considered duplicate,
 * this is why using custom validation.
 */

CloseContactSchema.pre('save', async function (next) {
    const nik = this.nik

    if (nik) {
        const exists = await this.schema.methods.getByNik(nik)
        if (exists) {
            throw new Error('NIK already exists')
        }
    }
    next()
})

CloseContactSchema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery())
    const nik = this.getUpdate().$set.nik

    if (nik && nik !== docToUpdate.nik) {
        const exists = await this.schema.methods.getByNik(nik)
        if (exists) {
            throw new Error('NIK already exists')
        }
    }
    next()
})

CloseContactSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('CloseContact', CloseContactSchema)
