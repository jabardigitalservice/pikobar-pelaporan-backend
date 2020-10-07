const User = require('../models/User')
const Case = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const History = require('../models/History')
const Notification = require('../models/Notification')
const Notif = require('../helpers/notification')
const Validate = require('../helpers/cases/revamp/handlerpost')
const { VERIFIED_STATUS, ROLE } = require('../helpers/constant')

const createCase = async (pre, payload, author, callback) => {
  try {
    const idCase = Validate.generateIdCase(author, pre, payload)
    const unitName = author.unit_id ? author.unit_id.name : null
    const verifiedStatus = author.role === ROLE.FASKES
      ? VERIFIED_STATUS.PENDING
      : VERIFIED_STATUS.VERIFIED

    const insertedCase = await Case.create({
      id_case: idCase,
      author: author._id,
      verified_status: verifiedStatus,
      travel: payload || 2,
      author_district_code: author.code_district_city,
      author_district_name: author.name_district_city,
      fasyankes_type: author.role,
      fasyankes_code: author._id,
      fasyankes_name: author.fullname,
      fasyankes_province_code: author.address_province_code,
      fasyankes_province_name: author.address_province_name,
      fasyankes_subdistrict_code: author.address_subdistrict_code,
      fasyankes_subdistrict_name: author.address_subdistrict_name,
      fasyankes_village_code: author.address_village_code,
      fasyankes_village_name: author.address_village_name,
      assignment_place: unitName,
      status_identity: 1,
      ...payload,
    })

    const insertedHis = await History.create({
      case: insertedCase._id,
      current_location_type: 'OTHERS',
      ...payload,
    })

    await Case.updateOne(
      { _id: ObjectId(insertedCase._id) },
      { $set: { last_history: insertedHis._id } },
      { upsert: true, new: true },
    )

    await Notif.send(Notification, User, insertedCase, author, 'case-created')
    callback(null, insertedCase)
  } catch (error) {
    callback(error, null)
  }
}

async function getCaseSectionStatus (id, callback) {
  try {
    const result = await Case.findById(id)
    .select([
      'status_identity',
      'status_clinical',
      'status_inspection_support',
      'status_travel_import',
      'status_travel_local',
      'status_travel_public',
      'status_transmission',
      'status_exposurecontact',
      'status_closecontact',
    ])

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

async function getCaseCountsOutsideWestJava(code, callback) {
  try {
    const districtCode = code.slice(-2)
    const params = {
      is_west_java: false,
      author_district_code: code,
    }

    const latestCase = await Case
      .find(params)
      .sort({id_case: -1})
      .limit(1)

    let count = 1
    if (latestCase.length) {
      count = (Number(latestCase[0].id_case.substring(15)) + 1)
    }

    let result = {
      idPusat: '01',
      districtCode: districtCode,
      count_pasien: count,
    }

    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.v2.cases.create',
    method: createCase,
  },
  {
    name: 'services.v2.cases.getCaseSectionStatus',
    method: getCaseSectionStatus
  },
  {
    name: 'services.v2.cases.getCaseCountsOutsideWestJava',
    method: getCaseCountsOutsideWestJava
  },
]
