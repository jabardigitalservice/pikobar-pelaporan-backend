'use strict';
const CasesRevamp = require('../models/Case')
const Check = require('../helpers/rolecheck')
const Filter = require('../helpers/filter/casefilter')
const { thisUnitCaseAuthors } = require('../helpers/cases/revamp/handlerget')
const { CRITERIA, WHERE_GLOBAL } = require('../helpers/constant')

async function getCaseSummary(query, user, callback) {
  try {
    const caseAuthors = await thisUnitCaseAuthors(user)
    const scope = Check.countByRole(user, caseAuthors)
    const filter = await Filter.filterCase(user, query)
    const searching = Object.assign(scope, filter)

    const conditions = [
      { $match: {
        $and: [  searching, { ...WHERE_GLOBAL, last_history: { $exists: true, $ne: null } } ]
      }},
      {
        $group: {
          _id: 'status',
          confirmed: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.CONF] },
                  ]
                }, 1, 0]
            }
          },
          probable: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.PROB] },
                  ]
                }, 1, 0]
            }
          },
          suspect: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.SUS] },
                  ]
                }, 1, 0]
            }
          },
          closeContact: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', CRITERIA.CLOSE] },
                  ]
                }, 1, 0]
            }
          },
        },
      },
      { $project: { _id : 0 } },
    ]
    const result = await CasesRevamp.aggregate(conditions)
    callback(null, result.shift())
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.cases_revamp.getSummary',
    method: getCaseSummary
  },
];