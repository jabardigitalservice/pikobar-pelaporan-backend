const mongoose = require('mongoose')

const VillageSchema = new mongoose.Schema({
    id: String,
    kemendagri_provinsi_kode: String,
    kemendagri_provinsi_nama: String,
    kemendagri_kabupaten_kode: String,
    kemendagri_kabupaten_nama: String,
    kemendagri_kecamatan_kode: String,
    kemendagri_kecamatan_nama: String,
    kemendagri_desa_kode: String,
    kemendagri_desa_nama: String,
    isdesa: String
})


VillageSchema.methods.toJSONFor = function () {
    return {
        desa_kode: this.kemendagri_desa_kode,
        desa_nama: this.kemendagri_desa_nama,
        kecamatan_nama: this.kemendagri_kecamatan_nama,
        kota_nama: this.kemendagri_kabupaten_nama
    }
}


module.exports = mongoose.model('Village', VillageSchema)