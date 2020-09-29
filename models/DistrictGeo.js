const mongoose = require('mongoose')

const DistrictGeoSchema = new mongoose.Schema({
  id: { type: String },
  kemendagri_provinsi_kode: { type: String },
  kemendagri_provinsi_nama: { type: String },
  kemendagri_kabupaten_kode: { type: String },
  kemendagri_kabupaten_nama: { type: String },
  kemendagri_kecamatan_kode: { type: String },
  kemendagri_kecamatan_nama: { type: String },
  kemendagri_desa_kode: { type: String },
  kemendagri_desa_nama: { type: String },
  latitude: { type: String },
  longitude: { type: String }
}, { timestamps: true })

DistrictGeoSchema.index({ kemendagri_provinsi_kode: 1 });
DistrictGeoSchema.index({ kemendagri_provinsi_nama: 1 });
DistrictGeoSchema.index({ kemendagri_kabupaten_kode: 1 });
DistrictGeoSchema.index({ kemendagri_kabupaten_nama: 1 });
DistrictGeoSchema.index({ kemendagri_kecamatan_kode: 1 });
DistrictGeoSchema.index({ kemendagri_kecamatan_nama: 1 });
DistrictGeoSchema.index({ kemendagri_desa_kode: 1 });
DistrictGeoSchema.index({ kemendagri_desa_nama: 1 });
DistrictGeoSchema.index({ latitude: 1 });
DistrictGeoSchema.index({ longitude: 1 });

module.exports = mongoose.model('DistrictGeo', DistrictGeoSchema)