const { RS } = require('../constant')

const filter = (params, gte, lt) => {
    let dateRange = []
    if (gte && lt) {
        dateRange = [
            { $gte: ["$lastHis.createdAt", new Date(gte) ] },
            { $lt: ["$lastHis.createdAt", new Date(lt) ] }
        ]
    }

    return {
        $sum: {
            $cond: [
              {
                $and: [
                  ...params,
                  ...dateRange
                ]
              }, 1, 0]
          }
    }
}

const sum = (prop, params, d) => {
    return {
        [prop]: [{
            $group: {
                _id: prop,
                aDay: filter(params, d.aDay, d.aDueDay),
                aWeek: filter(params, d.aWeek, d.aDueDay),
                aMonth: filter(params, d.aMonth, d.aDueDay),
            }
        }]
    }
}

const sumBasedOnLocation = (prop, params, d) => {
    const aDay = [d.aDay, d.aDueDay]
    const loc = (v) => Object.assign({}, { '$eq': [ '$lastHis.current_location_type', v ] })
    const type = (v) => Object.assign({}, { '$eq': [ '$lastHis.current_hospital_type', v ] })

    return {
        [prop]: [{
            $group: {
                _id: prop,
                referralHospital: filter([ ...params, loc('RS'), type(RS.REFERRAL) ], ...aDay),
                emergencyHospital: filter([ ...params, loc('RS'), type(RS.NON_REFERRAL) ], ...aDay),
                selfIsolation: filter([ ...params, loc('RUMAH') ], ...aDay),
            }
        }]
    }
}

const buildProject = (props) => {
    let project = {}

    for (let i in props) {

        const prop = props[i]

        project[prop] = {
            $cond: [
                { $eq: [ { "$size": `$${prop}` }, 0 ] },
                { $literal: null },
                { $arrayElemAt: [ `$${prop}`, 0 ] }
            ]
        }
    }

    return { "$project": project }
}

module.exports = {
    sum,
    sumBasedOnLocation,
    buildProject,
}
