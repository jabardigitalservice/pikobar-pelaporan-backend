const conf = require('../config.json')
const { _toString, _toDateString, _toUnsignedInt, getStringValueByIndex, getTransformedAge } = require('../helper')
const {
  getInspectionType,
  getSpecienType,
  getInspectionDate,
  getInspectionLocation,
  getSpecimenTo,
  getInspectionResult
} = require('./attributes/inspection_support')

const getNum = (d) => {
  return _toString(d[conf.cell.num])
}

const getInterviewerName = (d) => {
  return _toString(d[conf.cell.interviewers_name]) || undefined
}

const getInterviewerPhoneNumber = (d) => {
  return _toString(d[conf.cell.interviewers_phone_number]) || undefined
}

const getInterviewDate = (d) => {
  return _toString(d[conf.cell.interview_date]) || undefined
}

const isNikExists = (d) => {
  return !!getNik(d)
}

const getNik = (d) => {
  return _toString(d[conf.cell.nik]) || undefined
}

const getNikNote = (d) => {
  return _toString(d[conf.cell.note_nik]) || undefined
}

const isPhoneNumberExists = (d) => {
  return !!getPhoneNumber(d)
}

const getPhoneNumber = (d) => {
  return _toString(d[conf.cell.phone_number])
}

const getPhoneNumberNote = (d) => {
  return _toString(d[conf.cell.note_phone_number])
}

const getName = (d) => {
  return _toString(d[conf.cell.name]) || undefined
}

const getNameParent = (d) => {
  return _toString(d[conf.cell.name_parents]) || undefined
}

const getPlaceOfBirth = (d) => {
  return _toString(d[conf.cell.place_of_birth]) || undefined
}

const getBirthDate = (d) => {
  return _toDateString(d[conf.cell.birth_date])
}

const getAge = (d) => {
  return getTransformedAge(d[conf.cell.age])
}

const getAgeMonth = (d) => {
  return getTransformedAge(d[conf.cell.month])
}

const getGender = (d) => {
  const gender = d[conf.cell.gender]
  if (gender) {
    return gender == 'Perempuan' ? 'P' : 'L'
  }
  return gender
}

const getAddressProvinceCode = (d) => {
  return '32'
}

const getAddressProvinceName = (d) => {
  return 'Jawa Barat'
}

const getAddressDistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 1)
}

const getAddressDistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_district_code], 0)
}

const getAddressSubdistrictCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 1)
}


const getAddressSubdistrictName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_subdistrict_code], 0)

}

const getAddressVillageCode = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 1)
}

const getAddressVillageName = (d) => {
  return getStringValueByIndex(d[conf.cell.address_village_code], 0)
}

const getAddressRT = (d) => {
  return _toUnsignedInt(d[conf.cell.rt])
}

const getAddressRW = (d) => {
  return _toUnsignedInt(d[conf.cell.rw])
}

const getAddressStreet = (d) => {
  return _toString(d[conf.cell.address_street])
}

const getOccupation = (d) => {
  return _toString(d[conf.cell.occupation])
}

const getOfficeAddress = (d) => {
  return _toString(d[conf.cell.office_address])
}

const getNationality = (d) => {
  return _toString(d[conf.cell.nationality]) || undefined
}

const getNationalityName = (d) => {
  return _toString(d[conf.cell.nationality_name])
}

const getIncome = (d) => {
  let result = 0
  let selected = _toString(d[conf.cell.income])

  if (selected) { selected = selected.trim().toLowerCase() }

  switch(selected) {
    case 'tidak berpenghasilan':
      result = 0
      break;
    case '< 1 juta':
      result = 1
      break;
    case '1 s/d 3 juta':
      result = 2
      break;
    case '3 s/d 5 juta':
      result = 3
      break;
    case '> 5 juta':
      result = 4
      break;
    default:
      result = 0
  }

  return result
}

const getInspectionSupport = (d) => {
  const inspection_support = {
    inspection_type: getInspectionType(d),
    specimens_type: getSpecienType(d),
    inspection_date: getInspectionDate(d),
    inspection_location: getInspectionLocation(d),
    get_specimens_to: getSpecimenTo(d),
    inspection_result: getInspectionResult(d),
  }
  return [ inspection_support ]
}

module.exports = {
  // init,
  getNum,
  getInterviewerName,
  getInterviewerPhoneNumber,
  getInterviewDate,
  isNikExists,
  getNik,
  getNikNote,
  isPhoneNumberExists,
  getPhoneNumber,
  getPhoneNumberNote,
  getName,
  getNameParent,
  getPlaceOfBirth,
  getBirthDate,
  getAge,
  getAgeMonth,
  getGender,
  getAddressProvinceCode,
  getAddressProvinceName,
  getAddressDistrictCode,
  getAddressDistrictName,
  getAddressSubdistrictCode,
  getAddressSubdistrictName,
  getAddressVillageCode,
  getAddressVillageName,
  getAddressRT,
  getAddressRW,
  getAddressStreet,
  getOccupation,
  getOfficeAddress,
  getNationality,
  getNationalityName,
  getIncome,
  getInspectionSupport,
}