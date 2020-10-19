const conf = require('../config.json')
const { _toString, _toDateString, _toUnsignedInt } = require('../helper')

const getIdCaseNational = (d) => {
  return _toString(d[conf.cell.id_case_national])
}

const getIdCaseRelated = (d) => {
  if (!d[conf.cell.id_case_related]) return null
  if (! _toString(d[conf.cell.id_case_related].split)) return null
  return _toString(d[conf.cell.id_case_related].split('|')[0] || null)
}

const getNameCaseRelated = (d) => {
  if (!d[conf.cell.id_case_related]) return null
  if (!_toString(d[conf.cell.id_case_related].split)) return null
  return _toString(d[conf.cell.id_case_related].split('|')[1] || null)
}

const getName = (d) => {
  return _toString(d[conf.cell.name]) || undefined
}

const getNik = (d) => {
  return _toString(d[conf.cell.nik]) || null
}

const getBirthDate = (d) => {
  return _toDateString(d[conf.cell.birth_date])
}

const getAge = (d) => {
  if (d[conf.cell.age] === '' || d[conf.cell.age] === null) return null
  let age = _toUnsignedInt(d[conf.cell.age]) || '0'
  return _toString(age)
}

const getGender = (d) => {
  if (!d[conf.cell.gender]) return undefined
  return d[conf.cell.gender] == 'Perempuan' ? 'P' : 'L'
}

const getPhoneNumber = (d) => {
  return _toString(d[conf.cell.phone_number])
}

const getAddressStreet = (d) => {
  return _toString(d[conf.cell.address_street])
}

const getAddressProvinceCode = (d) => {
  return '32'
}

const getAddressProvinceName = (d) => {
  return 'Jawa Barat'
}

const getAddressDistrictCode = (d) => {
  if (!d[conf.cell.address_district_code]) return undefined
  return _toString(d[conf.cell.address_district_code].split('-')[1] || null)
}

const getAddressDistrictName = (d) => {
  if (!d[conf.cell.address_district_code]) return undefined
  return _toString(d[conf.cell.address_district_code].split('-')[0] || null)
}

const getAddressSubdistrictCode = (d) => {
  if (!d[conf.cell.address_subdistrict_code]) return undefined
  return _toString(d[conf.cell.address_subdistrict_code].split('-')[1] || null)
}


const getAddressSubdistrictName = (d) => {
  if (!d[conf.cell.address_subdistrict_code]) return undefined
  return _toString(d[conf.cell.address_subdistrict_code].split('-')[0] || null)
}

const getAddressVillageCode = (d) => {
  if (!d[conf.cell.address_village_code]) return undefined
  return _toString(d[conf.cell.address_village_code].split('-')[1] || null)
}

const getAddressVillageName = (d) => {
  if (!d[conf.cell.address_village_code]) return undefined
  return _toString(d[conf.cell.address_village_code].split('-')[0] || null)
}

const getNationality = (d) => {
  return _toString(d[conf.cell.nationality]) || undefined
}

const getNationalityName = (d) => {
  return _toString(d[conf.cell.nationality_name])
}

const getOccupation = (d) => {
  return _toString(d[conf.cell.occupation])
}

const getOfficeAddress = (d) => {
  return _toString(d[conf.cell.office_address])
}

module.exports = {
  // init,
  getIdCaseNational,
  getIdCaseRelated,
  getNameCaseRelated,
  getName,
  getNik,
  getBirthDate,
  getAge,
  getGender,
  getPhoneNumber,
  getAddressStreet,
  getAddressProvinceCode,
  getAddressProvinceName,
  getAddressDistrictCode,
  getAddressDistrictName,
  getAddressSubdistrictCode,
  getAddressSubdistrictName,
  getAddressVillageCode,
  getAddressVillageName,
  getNationality,
  getNationalityName,
  getOccupation,
  getOfficeAddress,
}
