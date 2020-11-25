const moment = require('moment')
const service = 'services.v2.cases'
const User = require('../models/User')
const Case = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const History = require('../models/History')
const pdfmaker = require('../helpers/pdfmaker')
const Notification = require('../models/Notification')
const Notif = require('../helpers/notification')
const { deleteProps, rollback } = require('../helpers/custom')
const Validate = require('../helpers/cases/revamp/handlerpost')
const { INSPECTION_TYPES, VERIFIED_STATUS, TRAVEL_TYPE, ROLE } = require('../helpers/constant')
const { getCountBasedOnDistrict } = require('../helpers/cases/global')

// scope helper
const _filteredFields = (field, filterProp, filterValue) => {
  return {
    $filter: {
      input: `$${field}`,
      as: "item",
      cond: { $eq: [ `$$item.${filterProp}`, filterValue ] }
    }
  }
}

const createCase = async (pre, payload, author, callback) => {
  // guarded fields
  deleteProps(['_id', 'id_case', 'verified_status'], payload)

  try {
    const idCase = Validate.generateIdCase(author, pre, payload)
    const unitName = author.unit_id ? author.unit_id.name : null
    const verifiedStatus = author.role === ROLE.FASKES
      ? VERIFIED_STATUS.DRAFT
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
      status_clinical: 1,
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
      'verified_status',
      'verified_comment',
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

async function exportEpidemiologicalForm (services, thisCase, callback) {
  try {
    const histories = await History.find({ case: thisCase._id })

    let closeContacts= []
    await services.cases.closecontact.getByCase(
      thisCase,
      (err, result) => {
        if (err) throw new Error
        closeContacts = result
      }
    )

    // build config
    const data = Object.assign(thisCase, { histories: histories, closeContacts: closeContacts })
    const pdfConfig = pdfmaker.epidemiologicalInvestigationsForm(data)

    // filename
    const caseName = thisCase.name.replace(/[\W_]+/g, '-')
    const fileName = `FORMULIR-PE-${caseName}-${moment().format("YYYY-MM-DD-HH-mm")}.pdf`

    // render pdf
    const pdfFile = await pdfmaker.generate(pdfConfig, fileName)

    callback(null, { pdfFile, fileName })
  } catch (e) {
    callback(e, null)
  }
}

async function getDetailCaseSummary(id, callback) {
  try {
    const aggQuery = [
      { $match: { _id: ObjectId(id) } }, { $addFields: {
          relatedCases: { $concatArrays: [ "$close_contact_parents", "$close_contact_childs" ] },
          pcr: _filteredFields('inspection_support', 'inspection_type', INSPECTION_TYPES.PCR),
          rapid: _filteredFields('inspection_support', 'inspection_type', INSPECTION_TYPES.RAPID),
          travelAbroad: _filteredFields('travelling_history', 'travelling_type', TRAVEL_TYPE.ABROAD),
          travelDomestic: _filteredFields('travelling_history', 'travelling_type', TRAVEL_TYPE.DOMESTIC),
      } },
      { $project: {
          _id: 0,
          pcrTotal: { $size: { "$ifNull": [ "$pcr", [] ] } },
          rapidTotal: { $size: { "$ifNull": [ "$rapid", [] ] } },
          relatedCasesTotal: { $size: { "$ifNull": [ "$relatedCases", [] ] } },
          travelAbroadTotal: { $size: { "$ifNull": [ "$travelAbroad", [] ] } },
          travelDomesticTotal: { $size: { "$ifNull": [ "$travelDomestic", [] ] } },
          visitedLocalAreaTotal: { $size: { "$ifNull": [ "$visited_local_area", [] ] } },
          visitedPublicPlaceTotal: { $size: { "$ifNull": [ "$visited_public_place", [] ] } },
      } }
    ]

    const result = await Case.aggregate(aggQuery)
    callback(null, result.shift())

  } catch (e) { callback(e, null) }
}

async function createMultiple (services, payload, author, callback) {
  const insertedCase = []
  try {
    // get requirement doc to generate id case
    for (let i = 0; i < payload.length; i++) {
      const pre = await getCountBasedOnDistrict(
        services,
        payload[i].address_district_code
      )

      await createCase(
        pre, payload[i], author,
        (err, res) => {
          if (err) throw new Error
          insertedCase.push({_id: res._id})
        }
      )

    }
    callback(null, { inserted: insertedCase.length })
  } catch (e) {
    rollback(Case, insertedCase)
    callback(e, null)
  }
}

module.exports = [
  { name: `${service}.create`, method: createCase },
  { name: `${service}.createMultiple`, method: createMultiple },
  { name: `${service}.getCaseSectionStatus`, method: getCaseSectionStatus },
  { name: `${service}.getDetailCaseSummary`, method: getDetailCaseSummary },
  { name: `${service}.exportEpidemiologicalForm`, method: exportEpidemiologicalForm },
  { name: `${service}.getCaseCountsOutsideWestJava`, method: getCaseCountsOutsideWestJava },
]
