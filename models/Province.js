const mongoose = require('mongoose')

const ProvinceSchema = new mongoose.Schema({
    id: String,
    kemendagri_provinsi_kode: String,
    kemendagri_provinsi_nama: String
})


ProvinceSchema.methods.toJSONFor = function () { 
    return {
        provinsi_kode : this.kemendagri_provinsi_kode,
        provinsi_nama : this.kemendagri_provinsi_nama
    }
}


module.exports = mongoose.model('Province', ProvinceSchema)