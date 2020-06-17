const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UnitSchema = new mongoose.Schema({
    unit_level: Number,
    unit_code: String, //null sementara
    unit_type: String, //puskesmas, rs, klinik
    name: String,
    description: String,
    address: String,
    phone_numbers: String,
    kemendagri_kabupaten_kode: String,
    kemendagri_kecamatan_kode: String,
    kemendagri_kelurahan_kode: String,
    rs_jabar: { type: Boolean, default:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{timestamps: true});

UnitSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Unit', UnitSchema);