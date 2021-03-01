const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UnitSchema = new mongoose.Schema({
  unit_level: Number,
  unit_code: String, //null sementara
  unit_type: String, //puskesmas, rs, klinik
  rs_type: String, // rs rujukan, non rujukan, darurat
  faskes_code: String,
  name: String,
  description: String,
  code_district_code: { type: String, default: null },
  name_district_code: { type: String, default: null },
  address_province_code: { type: String, default: 32 },
  address_province_name: { type: String, default: "Jawa Barat" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  delete_status: String,
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

UnitSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Unit', UnitSchema)