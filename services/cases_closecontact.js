
const Case = require('../models/Case')
const Helper = require('../helpers/custom')
const { rollback } = require('../helpers/custom')
const { CRITERIA } = require('../helpers/constant')
const {
  append,
  relatedPayload,
} = require('../helpers/closecontact/handler')

async function getByCase(pre, callback) {
  try {
    const aggcase = [
      {
        $match: {
          id_case: pre.id_case,
        },
      },
      {
        $addFields: {
          relatedCases: {
            $concatArrays: [
              "$close_contact_parents",
              "$close_contact_childs",
            ],
          },
        },
      },
      { $unwind: "$relatedCases" },
      { $replaceRoot: { newRoot: "$relatedCases" } },
      {
        $lookup: {
          from: "cases",
          localField: "id_case",
          foreignField: "id_case",
          as: "case",
        },
      },
      { $unwind: "$case" },
      {
        $project: {
          _id: "$case._id",
          id_case: "$case.id_case",
          name: "$case.name",
          nik: "$case.nik",
          phone_number: "$case.phone_number",
          age: "$case.age",
          birth_date: "$case.birth_date",
          gender: "$case.gender",
          status: "$case.status",
          address_street: "$case.address_street",
          address_district_name: "$case.address_district_name",
          address_subdistrict_name: "$case.address_subdistrict_name",
          address_village_name: "$case.address_village_name",
          relation: 1,
          relation_others: 1,
          activity: 1,
          activity_others: 1,
          first_contact_date: 1,
          last_contact_date: 1,
          id_case_registrant: 1,
          is_access_granted: 1,
          is_reported: "$case.is_reported",
          createdAt: 1,
        },
      },
    ]

    const result = await Case
      .aggregate(aggcase)
      .sort({ createdAt: -1 })

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }

}

const create = async (services, pre, author, payload, callback) => {
  const result = []
  const insertedIds = []
  const thisCase = pre.cases
  const idCaseRegistrant = thisCase.id_case

  for (i in payload) {
    let appendField, embedField, foundedCase, insertedCase;
    const req = payload[i]

    if (req.status === CRITERIA.CLOSE) {
      appendField = 'close_contact_childs'
      embedField = 'close_contact_parents'
    } else {
      appendField = 'close_contact_parents'
      embedField = 'close_contact_childs'
    }

    try {
      if (req.id_case || req.nik) {
        // (is_access_granted = false)
        // if this related case founded, update & append this case as an embeded object to this related case
        foundedCase = await append(embedField, Case, req, relatedPayload(thisCase, idCaseRegistrant, false))
        if (foundedCase) {
          req.id_case = foundedCase.id_case
        }
      }

      // (is_access_granted = false)
      // if this related case not founded, create & append this case as an embeded object to this related case
      if (!foundedCase) {
        const createCasePayload = {
          final_result: '5',
          is_reported: false,
          verified_status: 'verified',
          status: req.status,
          origin_closecontact: true,
          current_location_type: 'OTHERS',
          [embedField]: {
            ...relatedPayload(
              thisCase,
              idCaseRegistrant,
              false,
            ),
          },
          ...req,
        }

        // prerequisites per-premierCase to creating new case
        const pre = {
          count_case: {},
          count_case_pending: {},
          case_count_outside_west_java: {},
        }

        await services.cases.getCountByDistrict(
          req.address_district_code,
          (err, res) => {
            if (err) throw new Error
            pre.count_case = res
          })

        await services.cases.getCountPendingByDistrict(
          req.address_district_code,
          (err, res) => {
            if (err) throw new Error
            pre.count_case_pending = res
          })

        await services.v2.cases.getCaseCountsOutsideWestJava(
          author.code_district_city,
          (err, res) => {
            if (err) throw new Error
            pre.case_count_outside_west_java = res
          })

        await services.cases_revamp.create(
          services, createCasePayload, author, pre,
          (err, res) => {
            if (err) throw new Error

            insertedCase = res
            req.id_case = res.id_case
            result.push(insertedCase)
            insertedIds.push(insertedCase)
          })

      } else {
        result.push(foundedCase)
      }

      // append this related case as an appended object to this case (is_access_granted = true)
      await append(appendField, Case, thisCase, relatedPayload(req, idCaseRegistrant, true))

    } catch (e) {
      rollback(Case, insertedIds)
      callback(e, null)
    }
  }

  callback(null, result)
}

async function detailCaseContact(thisCase, contactCase, callback) {
  try {
    const raw = await Case.aggregate([
      {
        $match: {
          id_case: thisCase.id_case,
        },
      },
      {
        $addFields: {
          relatedCases: {
            $concatArrays: [
              "$close_contact_parents",
              "$close_contact_childs",
            ],
          },
        },
      },
      { $unwind: "$relatedCases" },
      { $replaceRoot: { newRoot: "$relatedCases" } },
      { $match: { id_case: contactCase.id_case } },
      {
        $lookup: {
          from: "cases",
          localField: "id_case",
          foreignField: "id_case",
          as: "relatedCase",
        },
      },
      {
        $project: {
          relatedCase: {
            close_contact_childs: 0,
            close_contact_parents: 0,
            createdAt: 0,
            updatedAt: 0,
            last_history: 0,
            __v: 0,
          },
        }
      },
      { $unwind: "$relatedCase" },
    ])

    // transform
    const detail = raw.shift()
    const { relatedCase, ...thisContactCase } = detail
    const result = {
      ...detail.relatedCase,
      ...thisContactCase,
    }

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}


async function updateCaseContact(thisCase, contactCase, req, callback) {
  const self = [ thisCase.id_case, contactCase.id_case ]
  const embeded = [ contactCase.id_case, thisCase.id_case ]

  const updateContactCache = (prop, idCase, idCaseRelated) => {
    return Case.updateOne({
      id_case: idCase,
      [`${prop}.id_case`]: idCaseRelated
    }, {
      $set: {
        [`${prop}.$.relation`]: req.relation,
        [`${prop}.$.relation_others`]: req.relation_others,
        [`${prop}.$.activity`]: req.activity,
        [`${prop}.$.activity_others`]: req.activity_others,
        [`${prop}.$.first_contact_date`]: req.first_contact_date,
        [`${prop}.$.last_contact_date`]: req.last_contact_date,
      }
    })
  }

  try {
    // guarded fields
    Helper.deleteProps(['id_case', 'verified_status'], req)

    const result = await Case.updateOne(
      { id_case: contactCase.id_case, },
      { $set: req },
      { runValidators: true, context: 'query', new: true },
    )

    // embeded/caching attribute, minimized lookup operation
    await updateContactCache('close_contact_parents', ...self)
    await updateContactCache('close_contact_childs', ...self)
    await updateContactCache('close_contact_parents', ...embeded)
    await updateContactCache('close_contact_childs', ...embeded)

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

async function pullCaseContact(thisCase, contactCase, callback) {
  const pullingContact = (source, target) => {
    return Case.updateOne(
      { id_case: source.id_case },
      {
        $pull: {
          close_contact_parents: {
            id_case: target.id_case
          },
          close_contact_childs: {
            id_case: target.id_case
          },
        },
      },
    )
  }
  try {
    const deleteOriginRegistrant = await pullingContact(thisCase, contactCase)

    const deleteOriginEmebeded = await pullingContact(contactCase, thisCase)

    const result = !!(deleteOriginRegistrant && deleteOriginEmebeded)

    callback(null, result)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.cases.closecontact.getByCase',
    method: getByCase
  },
  {
    name: 'services.cases.closecontact.create',
    method: create
  },
  {
    name: 'services.cases.closecontact.detailCaseContact',
    method: detailCaseContact
  },
  {
    name: 'services.cases.closecontact.updateCaseContact',
    method: updateCaseContact
  },
  {
    name: 'services.cases.closecontact.pullCaseContact',
    method: pullCaseContact
  },
]
