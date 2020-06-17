const mongoose = require('mongoose')

require('../models/DistrictCity')
require('../models/SubDistrict')
require('../models/Village')
require('../models/Unit')
require('../models/Lab')

const Districtcity = mongoose.model('Districtcity')
const SubDistrict = mongoose.model('SubDistrict')
const Village = mongoose.model('Village')
const Unit = mongoose.model('Unit')
const Lab = mongoose.model('Lab')


function getDistrictCity(request, callback) {
  var params = new Object();
  params.kemendagri_provinsi_kode = "32";

  if (request.kota_kode) {
    params.kemendagri_kabupaten_kode= request.kota_kode;
  }

  Districtcity.find(params)
    .sort({kemendagri_kabupaten_nama: 'asc'})
    .exec()
    .then(city => {
        let res = city.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getSubDistrict(city_code, request, callback) {
  var params = new Object();
  params.kemendagri_kabupaten_kode = city_code;

  if (request.kecamatan_kode) {
       params.kemendagri_kecamatan_kode = request.kecamatan_kode
  }

  SubDistrict.find(params)
    .sort({ kemendagri_kecamatan_nama: 'asc' })
    .exec()
    .then(distric => {
        let res = distric.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getSubDistrictDetail(kecamatan_kode, callback) {
  SubDistrict.find({ kemendagri_kecamatan_kode: kecamatan_kode})
    .sort({ kemendagri_kecamatan_nama: 'asc' })
    .exec()
    .then(distric => {
        let res = distric.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getVillage(kecamatan_code, request, callback) {
  var params = new Object();
  params.kemendagri_kecamatan_kode = kecamatan_code;

  if (request.desa_kode) {
    params.kemendagri_desa_kode = request.desa_kode;
  }

  Village.find(params)
      .sort({ kemendagri_desa_nama: 'asc' })
      .exec()
      .then(vill => {
          let res = vill.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))
}

function getVillageDetail(desa_kode, callback) {
  Village.find({ kemendagri_desa_kode: desa_kode })
      .sort({ kemendagri_desa_nama: 'asc' })
      .exec()
      .then(vill => {
          let res = vill.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))
}

function getHospital(query, callback) {
  var params = new Object();

  if(query.search){
    params.name = new RegExp(query.search, "i")
  }

  if(query.city_code){
    params.kemendagri_kabupaten_kode = query.city_code
  }

  if(query.rs_jabar){
    params.rs_jabar = query.rs_jabar === 'true'
  }

  Unit.find(Object.assign(params, {unit_type: 'rumahsakit'}))
      .exec()
      .then(hsp => {
          let res = hsp.map(q => q.toJSONFor())
          return callback(null, res)
      })
      .catch(err => callback(err, null))

}

function getLab(query, callback) {
  var params = new Object();

  if (query.search) {
    params.lab_name = new RegExp(query.search, "i")
  }

  Lab.find(params)
    .exec()
    .then(res => {
      let result = res.map(q => q.toJSONFor())
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

module.exports = [
  {
    name: 'services.areas.getDistrictCity',
    method: getDistrictCity
  },
  {
    name: 'services.areas.getSubDistrict',
    method: getSubDistrict
  },
  {
    name: 'services.areas.getSubDistrictDetail',
    method: getSubDistrictDetail
  },
  {
    name: 'services.areas.getVillage',
    method: getVillage
  },
  {
    name: 'services.areas.getVillageDetail',
    method: getVillageDetail
  },
  {
    name: 'services.areas.getHospital',
    method: getHospital
  },
  {
    name: 'services.areas.getLab',
    method: getLab
  }
]
