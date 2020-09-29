const {
    ROLE,
    CRITERIA,
    WHERE_GLOBAL
} = require('../constant')

const {
    sum,
    sumBasedOnLocation,
    buildProject
} = require('../filter/dailyreportfilter')

const {
    addFields,
    transformedFields
} = require('./transformer')

const aggCaseDailyReport = (user, query, searching, dates) => {

    if(user.role === ROLE.PROVINCE || user.role === ROLE.ADMIN){
      if(query.address_district_code){
        searching.author_district_code = query.address_district_code
      }
    }

    const match = {
        $match: {
            $and: [
                searching, WHERE_GLOBAL,
            ]
        }
    }

    const lookup = {
      $lookup:
      {
        from: 'histories',
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$case",  "$$id"] }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 2 }, // prev history needs
        ],
        as: 'histories'
      },
    }

    const group = {
        ...sum('suspect', [
            { $eq: ['$status', CRITERIA.SUS] }
        ], dates),
        ...sum('probable', [
            { $eq: ['$status', CRITERIA.PROB] }
        ], dates),
        ...sum('suspectIsolated', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$final_result', '4'] }
        ], dates),
        ...sum('suspectDiscarded', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$final_result', '3'] }
        ], dates),
        ...sum('confirmed', [
            { $eq: ['$status', CRITERIA.CONF] }
        ], dates),
        ...sum('confirmedSymptomatic', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $isArray: ['$lastHis.diagnosis'] },
            { $ne: ['$lastHis.diagnosis', [] ] }
        ], dates),
        ...sum('confirmedAsymptomatic', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $in: ['$lastHis.diagnosis', [null, []] ] }
        ], dates),
        ...sum('confirmedTravel', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ["$travelling_history_before_sick_14_days", true] }
        ], dates),
        ...sum('confirmedContact', [
          { $eq: ['$status', CRITERIA.CONF] },
          { $eq: ['$prevHis.status', CRITERIA.CLOSE] },
      ], dates),
        ...sum('confirmedNoTravel', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $or: [
                { $eq: ["$travelling_history_before_sick_14_days", false] },
                { $ne: ["$prevHis.status", CRITERIA.CLOSE] }
              ]
            }
        ], dates),
        ...sum('confirmedRecovered', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$final_result', '1'] }
        ], dates),
        ...sum('closeContact', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$final_result', '4'] },
        ], dates),
        ...sum('closeContactNew', [
            { $eq: ['$status', CRITERIA.CLOSE] }
        ], dates),
        ...sum('closeContactSuspect', [
            { $eq: ['$status', CRITERIA.SUS] },
            { $eq: ['$prevHis.status', CRITERIA.CLOSE] },
        ], dates),
        ...sum('closeContactConfirmed', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$prevHis.status', CRITERIA.CLOSE] },
        ], dates),
        ...sum('closeContactDiscarded', [
            { $in: ['$status', [ CRITERIA.CONF, CRITERIA.CLOSE ] ] },
            { $eq: ['$final_result', '1'] },
        ], dates),
        ...sum('deceaseConfirmed', [
            { $eq: ['$status', CRITERIA.CONF] },
            { $eq: ['$final_result', '2'] },
        ], dates),
        ...sum('deceaseProbable', [
            { $eq: ['$status', CRITERIA.PROB] },
            { $eq: ['$final_result', '2'] },
        ], dates),
        ...sum('pcrSwab', [
          { $eq: ['$pcrSwab', true] },
        ], dates),
        ...sum('rapidTest', [
            { $eq: ['$rapidTest', true] },
        ], dates),
        ...sum('rapidTestReactive', [
            { $eq: ['$rapidTestReactive', true] },
        ], dates),
        ...sum('pcr', [
            { $eq: ['$pcr', true] },
        ], dates),
        ...sum('pcrPositive', [
            { $eq: ['$pcrPositive', true] },
        ], dates),
        ...sumBasedOnLocation('suspectProbableIsolation', [
            { $in: [ '$status', [CRITERIA.SUS, CRITERIA.PROB] ] },
        ], dates),
        ...sumBasedOnLocation('confirmedIsolation', [
            { $eq: [ '$status', CRITERIA.CONF ] },
        ], dates),
        ...sumBasedOnLocation('closeContactIsolation', [
            { $eq: [ '$status', CRITERIA.CLOSE ] },
            { $ne: [ '$final_result', null ] },
        ], dates)
    }

    const facet = { $facet: group }

    const unwind = { $unwind: '$lastHis' }

    const props = Object.keys(facet.$facet).map((key) => key)

    const project = buildProject(props)

    const aggCaseQuery = [
        match,
        lookup,
        addFields,
        transformedFields,
        unwind,
        facet,
        project
    ]

    return aggCaseQuery
}

module.exports = {
    aggCaseDailyReport
}
