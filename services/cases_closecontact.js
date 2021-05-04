
const Case = require('../models/Case')
const Helper = require('../helpers/custom')
const { rollback } = require('../helpers/custom')
const { CRITERIA } = require('../helpers/constant')
const { getCountBasedOnDistrict } = require('../helpers/cases/global')
const { closeContactsColumn, relatedCloseContactsColumn, lookupCases } = require('../utils')
const {
  append,
  relatedPayload,
} = require('../helpers/closecontact/handler')

async function getByCase(pre, callback) {
  try {
    const aggcase = [{ $match: { id_case: pre.id_case }},
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
      lookupCases('case'),
      { $unwind: "$case" },
      { $project: closeContactsColumn},
    ]

    const result = await Case.aggregate(aggcase).sort({ createdAt: -1 })
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
        foundedCase = await append(embedField, Case, req, relatedPayload(req, author, thisCase, idCaseRegistrant, false))
        if (foundedCase) {
          req.id_case = foundedCase.id_case
          req.author_district_code = foundedCase.author_district_code
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
              req,
              author,
              thisCase,
              idCaseRegistrant,
              false,
            ),
          },
          ...req,
        }

        // get requirement doc to generate id case
        const pre = await getCountBasedOnDistrict(services, req.address_district_code)

        await services.v2.cases.create(
          pre, createCasePayload, author,
          (err, res) => {
            if (err) throw new Error

            insertedCase = res
            req.id_case = res.id_case
            req.author_district_code = res.author_district_code
            result.push(insertedCase)
            insertedIds.push(insertedCase)
          })

      } else {
        result.push(foundedCase)
      }

      // append this related case as an appended object to this case (is_access_granted = true)
      await append(appendField, Case, thisCase, relatedPayload(req, author, req, idCaseRegistrant, true))

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
      { $match: { id_case: thisCase.id_case } },
      {
        $addFields: {
          relatedCases: {
            $concatArrays: [ "$close_contact_parents", "$close_contact_childs", ],
          },
        },
      },
      { $unwind: "$relatedCases" },
      { $replaceRoot: { newRoot: "$relatedCases" } },
      { $match: { id_case: contactCase.id_case } },
      lookupCases('relatedCase'),
      { $project: relatedCloseContactsColumn },
      { $unwind: "$relatedCase" },
    ])
    // transform
    const detail = raw.shift()
    const { relatedCase, ...thisContactCase } = detail
    const result = { ...detail.relatedCase, ...thisContactCase }
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
