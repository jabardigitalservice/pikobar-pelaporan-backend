const mongoose = require('mongoose')

const SubDistrictSchema = new mongoose.Schema({
    id: String,
    kemendagri_provinsi_kode: String,
    kemendagri_provinsi_nama: String,
    kemendagri_kabupaten_kode: String,
    kemendagri_kabupaten_nama: String,
    kemendagri_kecamatan_kode: String,
    kemendagri_kecamatan_nama: String
})


SubDistrictSchema.methods.toJSONFor = function () {
    return {
        kecamatan_kode: this.kemendagri_kecamatan_kode,
        kecamatan_nama: this.kemendagri_kecamatan_nama,
        kota_nama: this.kemendagri_kabupaten_nama
    }
}


module.exports = mongoose.model('SubDistrict', SubDistrictSchema)