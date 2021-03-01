const mongoose = require('mongoose')

const DistrictcitySchema = new mongoose.Schema({
    id: String,
    kemendagri_provinsi_kode : String,
    kemendagri_provinsi_nama : String,
    kemendagri_kabupaten_kode: String,
    kemendagri_kabupaten_nama: String,
    dinkes_kota_kode: String
},{strict: false})

DistrictcitySchema.methods.toJSONFor = function(p) { 
    return {
        kota_kode: this.kemendagri_kabupaten_kode,
        kota_nama: this.kemendagri_kabupaten_nama
    }
}


module.exports = mongoose.model('Districtcity', DistrictcitySchema)