
const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema({
  name: { type: String, default: null },
  description: { type: String, default: null },
  address: { type: String, default: null },
  phone_numbers: Array,
  kabkota_id: { type: Number, default: null },
  kec_id: { type: Number, default: null },
  kel_id: { type: Number, default: null },
  kemendagri_kabupaten_kode: { type: String, default: null },
  kemendagri_kecamatan_kode: { type: String, default: null },
  kemendagri_kelurahan_kode: { type: String, default: null },
  latitude: { type: String, default: null },
  longitude: { type: String, default: null },
  rs_jabar: { type: Boolean }
})

HospitalSchema.methods.toJSONFor = function () {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    address: this.address,
    phone_numbers: this.phone_numbers,
    kabkota_id: this.kabkota_id,
    kec_id: this.kec_id,
    kel_id: this.kel_id,
    kemendagri_kabupaten_kode: this.kemendagri_kabupaten_kode,
    kemendagri_kecamatan_kode: this.kemendagri_kecamatan_kode,
    kemendagri_kelurahan_kode: this.kemendagri_kelurahan_kode,
    latitude: this.latitude,
    longitude: this.longitude,
    rs_jabar: this.rs_jabar
  }
}

module.exports = mongoose.model('Hospital', HospitalSchema)