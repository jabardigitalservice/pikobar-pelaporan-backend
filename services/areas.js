const Districtcity = require('../models/DistrictCity')
const SubDistrict = require('../models/SubDistrict')
const Village = require('../models/Village')
const Unit = require('../models/Unit')
const Lab = require('../models/Lab')
const Province = require('../models/Province')

const getDistrictCity = async (request, callback) => {
  let params = new Object();

  if (request.kota_kode) {
    params.kemendagri_kabupaten_kode = request.kota_kode;
  }

  if (request.provice_code) {
    params.kemendagri_provinsi_kode = request.provice_code
  }

  if (!request.status) {
    params.kemendagri_provinsi_kode = '32'
  }

  if (request.kemendagri_provinsi_nama) {
    params.kemendagri_provinsi_nama = request.kemendagri_provinsi_nama.toUpperCase()
  }

  try {
    const res = await Districtcity.find(params).sort({ kemendagri_kabupaten_nama: 'asc' })
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getSubDistrict = async (city_code, request, callback) => {
  var params = new Object();
  params.kemendagri_kabupaten_kode = city_code;

  if (request.kecamatan_kode) {
    params.kemendagri_kecamatan_kode = request.kecamatan_kode
  }

  try {
    const resSub = await SubDistrict.find(params).sort({ kemendagri_kecamatan_nama: 'asc' })
    callback(null, resSub.map(resSub => resSub.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getSubDistrictDetail = async (kecamatan_kode, callback) => {
  try {
    const res = await SubDistrict.find({ kemendagri_kecamatan_kode: kecamatan_kode })
    .sort({ kemendagri_kecamatan_nama: 'asc' })
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getVillage = async (kecamatan_code, request, callback) => {
  let params = new Object()
  params.kemendagri_kecamatan_kode = kecamatan_code

  if (request.desa_kode) {
    params.kemendagri_desa_kode = request.desa_kode
  }

  try {
    const res = await Village.find(params).sort({ kemendagri_desa_nama: 'asc' })
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getVillageDetail = async (desa_kode, callback) => {
  try {
    const res = await Village.find({ kemendagri_desa_kode: desa_kode }).sort({ kemendagri_desa_nama: 'asc' })
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getHospital = async (query, callback) => {
  var params = new Object();

  if (query.search) {
    params.name = new RegExp(query.search, "i")
  }

  if (query.city_code) {
    params.kemendagri_kabupaten_kode = query.city_code
  }

  if (query.rs_jabar) {
    params.rs_jabar = query.rs_jabar === 'true'
  }

  try {
    const res = await Unit.find(Object.assign(params, { unit_type: 'rumahsakit' }))
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const getLab = async (query, callback) => {
  var params = new Object();

  if (query.search) {
    params.lab_name = new RegExp(query.search, "i")
  }

  try {
    const res = await Lab.find(params)
    callback(null, res.map(res => res.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

const province = async(query, callback) =>{
  try {
    const result = await Province.find({})
    callback(null, result.map(x => x.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
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
  },
  {
    name: 'services.areas.province',
    method: province
  },
]
