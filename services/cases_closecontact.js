
const Case = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { rollback } = require('../helpers/custom')
const { CRITERIA } = require('../helpers/constant')
const {
  append,
  relatedPayload,
} = require('../helpers/closecontact/handler')

async function getByCase (pre, callback) {
  try {
    const aggcase = [
      {
        $match: {
          id_case: pre. id_case,
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
          age: "$case.nik",
          gender: "$case.gender",
          status: "$case.nik",
          address_district_name: "$case.address_district_name",
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
      .sort({createdAt: -1})

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

async function pullCaseContact (thisCase, contactCase, callback) {
  try {
    const deleteOriginRegistrant = await Case.updateOne(
      { _id: ObjectId(thisCase._id) },
      {
        $pull: {
          close_contact_parents: {
            id_case: contactCase.id_case
          },
          close_contact_childs: {
            id_case: contactCase.id_case
          },
        },
      },
    )

    const deleteOriginEmebeded = await Case.updateOne(
      { _id: ObjectId(contactCase._id) },
      {
        $pull: {
          close_contact_parents: {
            id_case: thisCase.id_case
          },
          close_contact_childs: {
            id_case: thisCase.id_case
          },
        },
      },
    )

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
    name: 'services.cases.closecontact.pullCaseContact',
    method: pullCaseContact
  },
]
